import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "../../../context/ThemeContext";

// Pure bitwise subnet logic

const ipToInt = (ip) => {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
};

const intToIp = (n) => [
  (n >>> 24) & 0xff,
  (n >>> 16) & 0xff,
  (n >>> 8) & 0xff,
  n & 0xff,
].join(".");

const intToBinary = (n) =>
  (n >>> 0).toString(2).padStart(32, "0");

const formatBinary = (bits) =>
  [bits.slice(0, 8), bits.slice(8, 16), bits.slice(16, 24), bits.slice(24, 32)].join(".");

const calcSubnet = (ip, cidr) => {
  const prefix = parseInt(cidr, 10);
  const maskInt = prefix === 0
    ? 0
    : (0xffffffff << (32 - prefix)) >>> 0;
  const wildcardInt = (~maskInt) >>> 0;
  const ipInt = ipToInt(ip);
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;
  const totalHosts = prefix >= 31 ? 0 : wildcardInt - 1;
  const firstHostInt = prefix >= 31 ? networkInt : networkInt + 1;
  const lastHostInt = prefix >= 31 ? broadcastInt : broadcastInt - 1;

  return {
    cidrNotation: `${intToIp(networkInt)}/${prefix}`,
    subnetMask: intToIp(maskInt),
    wildcardMask: intToIp(wildcardInt),
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    firstHost: totalHosts > 0 ? intToIp(firstHostInt) : "—",
    lastHost: totalHosts > 0 ? intToIp(lastHostInt) : "—",
    totalHosts: totalHosts > 0 ? totalHosts.toLocaleString() : "0",
    ipBinary: formatBinary(intToBinary(ipInt)),
    maskBinary: formatBinary(intToBinary(maskInt)),
    networkBinary: formatBinary(intToBinary(networkInt)),
    prefix,
    maskInt,
    ipInt,
    networkInt,
  };
};

const isValidIp = (value) =>
  /^(\d{1,3}\.){3}\d{1,3}$/.test(value) &&
  value.split(".").every((o) => Number(o) >= 0 && Number(o) <= 255);

// Sub-components

const MetricRow = ({ label, value, dark, onCopy }) => (
  <div
    className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-colors duration-300 ${
      dark ? "bg-zinc-950 border-zinc-800" : "bg-neutral-50 border-neutral-200"
    }`}
  >
    <span
      className={`text-[10px] font-black uppercase tracking-widest shrink-0 mr-3 ${
        dark ? "text-zinc-500" : "text-neutral-400"
      }`}
    >
      {label}
    </span>
    <div className="flex items-center gap-2 min-w-0">
      <span
        className={`text-sm font-mono font-bold truncate ${
          dark ? "text-zinc-200" : "text-zinc-800"
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onCopy(value)}
        title={`Copy ${label}`}
        className={`shrink-0 text-[10px] font-black uppercase tracking-widest transition-colors ${
          dark ? "text-zinc-600 hover:text-white" : "text-neutral-400 hover:text-black"
        }`}
      >
        Copy
      </button>
    </div>
  </div>
);

const BitMap = ({ prefix, dark }) => {
  const bits = Array.from({ length: 32 }, (_, i) => i < prefix);
  return (
    <div className="flex flex-wrap gap-[3px]">
      {bits.map((isNetwork, i) => (
        <div
          key={i}
          title={`Bit ${i + 1}: ${isNetwork ? "Network" : "Host"}`}
          className={`w-4 h-4 rounded-[3px] transition-colors duration-300 ${
            isNetwork
              ? dark ? "bg-white" : "bg-black"
              : dark ? "bg-zinc-700" : "bg-neutral-300"
          }`}
        />
      ))}
    </div>
  );
};

const BinaryRow = ({ label, binary, prefix, dark }) => {
  const chars = binary.replace(/\./g, "").split("");
  return (
    <div className="space-y-1">
      <span
        className={`text-[10px] font-black uppercase tracking-widest ${
          dark ? "text-zinc-500" : "text-neutral-400"
        }`}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-[2px] font-mono text-xs leading-5">
        {chars.map((bit, i) => {
          const isNetwork = i < prefix;
          const isOctetBoundary = i > 0 && i % 8 === 0;
          return (
            <span key={i} className="inline-flex items-center">
              {isOctetBoundary && (
                <span className={`mx-[3px] select-none ${dark ? "text-zinc-600" : "text-neutral-300"}`}>
                  .
                </span>
              )}
              <span
                className={`transition-colors ${
                  isNetwork
                    ? dark ? "text-white font-bold" : "text-black font-bold"
                    : dark ? "text-zinc-500" : "text-neutral-400"
                }`}
              >
                {bit}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Custom range slider styles

const sliderStyles = `
  .subnet-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 9999px;
    outline: none;
    cursor: pointer;
  }
  .subnet-slider::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 9999px;
  }
  .subnet-slider::-moz-range-track {
    height: 6px;
    border-radius: 9999px;
  }
  .subnet-slider.light-track::-webkit-slider-runnable-track {
    background: #d4d4d4;
  }
  .subnet-slider.light-track::-moz-range-track {
    background: #d4d4d4;
  }
  .subnet-slider.dark-track::-webkit-slider-runnable-track {
    background: #3f3f46;
  }
  .subnet-slider.dark-track::-moz-range-track {
    background: #3f3f46;
  }
  .subnet-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-top: -6px;
    cursor: pointer;
    transition: transform 0.15s ease;
  }
  .subnet-slider::-webkit-slider-thumb:active {
    transform: scale(1.2);
  }
  .subnet-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: transform 0.15s ease;
  }
  .subnet-slider.light-track::-webkit-slider-thumb {
    background: #000;
    border: 2px solid #000;
  }
  .subnet-slider.light-track::-moz-range-thumb {
    background: #000;
  }
  .subnet-slider.dark-track::-webkit-slider-thumb {
    background: #fff;
    border: 2px solid #fff;
  }
  .subnet-slider.dark-track::-moz-range-thumb {
    background: #fff;
  }
`;

// Main component

const SubnetCalculator = () => {
  const { dark } = useTheme();
  const [ip, setIp] = useState("192.168.1.1");
  const [cidr, setCidr] = useState(24);
  const [ipError, setIpError] = useState("");

  const isValid = isValidIp(ip);

  const result = useMemo(() => {
    if (!isValid) return null;
    return calcSubnet(ip, cidr);
  }, [ip, cidr, isValid]);

  const handleIpChange = (e) => {
    const val = e.target.value;
    setIp(val);
    if (val && !isValidIp(val)) {
      setIpError("Enter a valid IPv4 address (e.g. 192.168.1.1)");
    } else {
      setIpError("");
    }
  };

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleSample = () => {
    setIp("10.0.0.1");
    setCidr(16);
    setIpError("");
  };

  const handleReset = () => {
    setIp("192.168.1.1");
    setCidr(24);
    setIpError("");
  };

  const metrics = result
    ? [
        { label: "CIDR Notation", value: result.cidrNotation },
        { label: "Subnet Mask", value: result.subnetMask },
        { label: "Wildcard Mask", value: result.wildcardMask },
        { label: "Network Address", value: result.networkAddress },
        { label: "Broadcast Address", value: result.broadcastAddress },
        { label: "First Usable Host", value: result.firstHost },
        { label: "Last Usable Host", value: result.lastHost },
        { label: "Total Usable Hosts", value: result.totalHosts },
      ]
    : [];

  return (
    <div
      className={`min-h-[calc(100vh-76px)] px-4 sm:px-6 py-6 transition-colors duration-300 overflow-y-auto overflow-x-hidden relative flex flex-col justify-start ${
        dark ? "bg-zinc-950" : "bg-[#F7F7F7]"
      }`}
    >
      {/* Inject slider CSS once */}
      <style>{sliderStyles}</style>

      <title>Subnet Calculator — Dev Utilities</title>
      <meta
        name="description"
        content="Calculate IPv4 subnet masks, host ranges, CIDR notations, and binary visualizations completely offline."
      />

      {/* Background blobs */}
      <div
        className={`absolute top-[-10%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[100px] opacity-30 transition-colors duration-500 pointer-events-none ${
          dark ? "bg-zinc-800" : "bg-neutral-200"
        }`}
      />
      <div
        className={`absolute bottom-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[100px] opacity-30 transition-colors duration-500 pointer-events-none ${
          dark ? "bg-zinc-900" : "bg-neutral-100"
        }`}
      />

      {/* Card — overflow visible so binary expansion is never clipped */}
      <div
        className={`relative z-10 w-full max-w-5xl mx-auto rounded-[32px] border shadow-xl flex flex-col transition-all duration-300 ${
          dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-neutral-200"
        }`}
      >
        {/* Top accent bar */}
        <div
          className={`h-2 w-full rounded-t-[32px] transition-colors duration-500 ${
            dark ? "bg-white" : "bg-black"
          }`}
        />

        {/* Header */}
        <div className="px-5 sm:px-8 pt-6 sm:pt-8 flex items-center gap-3">
          <Link
            to="/devutilities"
            className={`p-2.5 rounded-xl border transition-all duration-200 active:scale-95 flex items-center justify-center shrink-0 ${
              dark
                ? "bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600"
                : "bg-white border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-350"
            }`}
            title="Back to Workspace"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1
            className={`text-xl sm:text-2xl font-black uppercase tracking-tight transition-colors duration-300 ${
              dark ? "text-white" : "text-black"
            }`}
          >
            IP Subnet Calculator
          </h1>
        </div>

        {/* Controls */}
        <div className="px-5 sm:px-8 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* IP Address */}
          <div className="flex flex-col space-y-2">
            <label
              className={`text-xs font-black uppercase tracking-widest ${
                dark ? "text-zinc-400" : "text-neutral-500"
              }`}
            >
              IP Address
            </label>
            <input
              type="text"
              value={ip}
              onChange={handleIpChange}
              placeholder="192.168.1.1"
              spellCheck={false}
              className={`px-4 py-3 rounded-2xl border text-sm font-mono outline-none transition-all duration-300 ${
                dark
                  ? `bg-zinc-950 text-white placeholder-zinc-700 ${
                      ipError
                        ? "border-zinc-600 focus:border-zinc-400"
                        : "border-zinc-800 focus:border-white focus:ring-1 focus:ring-white"
                    }`
                  : `bg-neutral-50 text-black placeholder-neutral-400 ${
                      ipError
                        ? "border-neutral-400 focus:border-neutral-600"
                        : "border-neutral-300 focus:border-black focus:ring-1 focus:ring-black"
                    }`
              }`}
            />
            {ipError && (
              <p className={`text-[11px] font-bold ${dark ? "text-zinc-400" : "text-neutral-500"}`}>
                {ipError}
              </p>
            )}
          </div>

          {/* CIDR Slider */}
          <div className="flex flex-col space-y-2">
            <label
              className={`text-xs font-black uppercase tracking-widest ${
                dark ? "text-zinc-400" : "text-neutral-500"
              }`}
            >
              CIDR Prefix — /{cidr}
            </label>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="range"
                min={0}
                max={32}
                value={cidr}
                onChange={(e) => setCidr(Number(e.target.value))}
                className={`subnet-slider flex-1 ${dark ? "dark-track" : "light-track"}`}
              />
              <span
                className={`text-sm font-mono font-black w-8 text-right shrink-0 ${
                  dark ? "text-white" : "text-black"
                }`}
              >
                /{cidr}
              </span>
            </div>
            <div
              className={`flex justify-between text-[10px] font-bold ${
                dark ? "text-zinc-600" : "text-neutral-400"
              }`}
            >
              <span>/0</span>
              <span>/8</span>
              <span>/16</span>
              <span>/24</span>
              <span>/32</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 sm:px-8 pt-4 flex gap-3">
          <button
            type="button"
            onClick={handleSample}
            className={`px-4 py-2.5 rounded-xl border font-bold text-sm transition-all duration-300 active:scale-95 ${
              dark
                ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                : "border-neutral-300 text-neutral-600 hover:bg-neutral-100 hover:text-black"
            }`}
          >
            Sample
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={`px-4 py-2.5 rounded-xl border font-bold text-sm transition-all duration-300 active:scale-95 ${
              dark
                ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                : "border-neutral-300 text-neutral-600 hover:bg-neutral-100 hover:text-black"
            }`}
          >
            Reset
          </button>
        </div>

        {/* Main output */}
        <div className="px-5 sm:px-8 py-6 space-y-6">

          {/* Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {isValid
              ? metrics.map((m) => (
                  <MetricRow
                    key={m.label}
                    label={m.label}
                    value={m.value}
                    dark={dark}
                    onCopy={handleCopy}
                  />
                ))
              : Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-12 rounded-2xl border animate-pulse ${
                      dark ? "bg-zinc-800/50 border-zinc-800" : "bg-neutral-100 border-neutral-200"
                    }`}
                  />
                ))}
          </div>

          {/* Visual Subnet Bitmap */}
          <div
            className={`rounded-2xl border p-5 space-y-4 transition-colors duration-300 ${
              dark ? "bg-zinc-950 border-zinc-800" : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  dark ? "text-zinc-500" : "text-neutral-400"
                }`}
              >
                32-bit Address Map
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-[2px] ${dark ? "bg-white" : "bg-black"}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${dark ? "text-zinc-400" : "text-neutral-500"}`}>
                    Network
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-[2px] ${dark ? "bg-zinc-700" : "bg-neutral-300"}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${dark ? "text-zinc-400" : "text-neutral-500"}`}>
                    Host
                  </span>
                </div>
              </div>
            </div>
            <BitMap prefix={cidr} dark={dark} />
            <p className={`text-[10px] font-bold ${dark ? "text-zinc-600" : "text-neutral-400"}`}>
              {cidr} network bit{cidr !== 1 ? "s" : ""} · {32 - cidr} host bit{32 - cidr !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Binary Expansion */}
          {isValid && result && (
            <div
              className={`rounded-2xl border p-5 space-y-5 transition-colors duration-300 ${
                dark ? "bg-zinc-950 border-zinc-800" : "bg-neutral-50 border-neutral-200"
              }`}
            >
              <span
                className={`text-[10px] font-black uppercase tracking-widest block ${
                  dark ? "text-zinc-500" : "text-neutral-400"
                }`}
              >
                Binary Expansion
              </span>
              <div className="space-y-4">
                <BinaryRow
                  label="IP Address"
                  binary={result.ipBinary}
                  prefix={result.prefix}
                  dark={dark}
                />
                <BinaryRow
                  label="Subnet Mask"
                  binary={result.maskBinary}
                  prefix={result.prefix}
                  dark={dark}
                />
                <BinaryRow
                  label="Network Address"
                  binary={result.networkBinary}
                  prefix={result.prefix}
                  dark={dark}
                />
              </div>
            </div>
          )}

          <p
            className={`text-[10px] font-bold uppercase tracking-widest text-right pb-2 ${
              dark ? "text-zinc-600" : "text-neutral-400"
            }`}
          >
            All calculations are client-side · works offline
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubnetCalculator;