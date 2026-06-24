import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { toast } from "sonner";
import { FaArrowLeft, FaCopy, FaImage, FaPalette, FaRandom, FaPlus, FaTrash } from "react-icons/fa";

const backgroundPresets = [
  {
    name: "Sunset Gradient",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    angle: 135,
    stops: [
      { color: "#667eea", stop: 0 },
      { color: "#764ba2", stop: 100 },
    ],
  },
  {
    name: "Ocean Breeze",
    value: "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
    angle: 120,
    stops: [
      { color: "#89f7fe", stop: 0 },
      { color: "#66a6ff", stop: 100 },
    ],
  },
  {
    name: "Forest Green",
    value: "linear-gradient(120deg, #a8edea 0%, #fed6e3 100%)",
    angle: 120,
    stops: [
      { color: "#a8edea", stop: 0 },
      { color: "#fed6e3", stop: 100 },
    ],
  },
  {
    name: "Purple Dream",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    angle: 135,
    stops: [
      { color: "#667eea", stop: 0 },
      { color: "#764ba2", stop: 50 },
      { color: "#f093fb", stop: 100 },
    ],
  },
  {
    name: "Warm Flame",
    value: "linear-gradient(45deg, #ff9a56 0%, #ff6a88 100%)",
    angle: 45,
    stops: [
      { color: "#ff9a56", stop: 0 },
      { color: "#ff6a88", stop: 100 },
    ],
  },
  {
    name: "Cool Blues",
    value: "linear-gradient(135deg, #2af598 0%, #009efd 100%)",
    angle: 135,
    stops: [
      { color: "#2af598", stop: 0 },
      { color: "#009efd", stop: 100 },
    ],
  },
  {
    name: "Mesh Pattern",
    value: "radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)",
    isMesh: true,
  },
];

export default function CssGlassmorphismPlayground() {
  const { dark } = useTheme();

  // Glassmorphism controls
  const [blur, setBlur] = useState(10);
  const [bgOpacity, setBgOpacity] = useState(0.25);
  const [borderRadius, setBorderRadius] = useState(20);
  const [borderThickness, setBorderThickness] = useState(1);
  const [cardColor, setCardColor] = useState("#ffffff");

  // Box shadow controls
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(8);
  const [shadowBlur, setShadowBlur] = useState(32);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowOpacity, setShadowOpacity] = useState(0.18);
  const [shadowColor, setShadowColor] = useState("#000000");

  // Background controls
  const [backgroundType, setBackgroundType] = useState("gradient");
  const [solidBgColor, setSolidBgColor] = useState("#667eea");
  const [gradientBg, setGradientBg] = useState(backgroundPresets[0].value);
  const [imageUrl, setImageUrl] = useState("");

  // Custom gradient stops state
  const [gradientMode, setGradientMode] = useState("preset"); // "preset" or "custom"
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [gradientStops, setGradientStops] = useState([
    { color: "#667eea", stop: 0 },
    { color: "#764ba2", stop: 100 },
  ]);
  const [gradientAngle, setGradientAngle] = useState(135);
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  const generateGradientString = (stops, angle) => {
    return `linear-gradient(${angle}deg, ${stops
      .map((s) => `${s.color} ${s.stop}%`)
      .join(", ")})`;
  };

  const handleStopColorChange = (index, color) => {
    const updated = [...gradientStops];
    updated[index] = { ...updated[index], color };
    setGradientStops(updated);
    setGradientBg(generateGradientString(updated, gradientAngle));
  };

  const handleStopPositionChange = (index, position) => {
    const updated = [...gradientStops];
    updated[index] = { ...updated[index], stop: position };
    setGradientStops(updated);
    setGradientBg(generateGradientString(updated, gradientAngle));
  };

  const addColorStop = () => {
    if (gradientStops.length >= 6) {
      toast.error("Maximum of 6 color stops supported!");
      return;
    }
    const lastStop = gradientStops[gradientStops.length - 1];
    const secondLastStop = gradientStops.length >= 2 ? gradientStops[gradientStops.length - 2] : { stop: 0 };
    let newStopPos = Math.min(100, Math.floor((lastStop.stop + secondLastStop.stop) / 2));
    if (newStopPos === lastStop.stop) {
      newStopPos = Math.min(100, lastStop.stop + 10);
    }
    const updated = [
      ...gradientStops,
      { color: "#f093fb", stop: newStopPos },
    ].sort((a, b) => a.stop - b.stop);
    setGradientStops(updated);
    setGradientBg(generateGradientString(updated, gradientAngle));
    const newIndex = updated.findIndex((s) => s.stop === newStopPos);
    setActiveStopIndex(newIndex >= 0 ? newIndex : 0);
    toast.success("Color stop added!");
  };

  const addColorStopAt = (percentage) => {
    if (gradientStops.length >= 6) {
      toast.error("Maximum of 6 color stops supported!");
      return;
    }
    let nearestColor = "#f093fb";
    let minDiff = 100;
    gradientStops.forEach((s) => {
      const diff = Math.abs(s.stop - percentage);
      if (diff < minDiff) {
        minDiff = diff;
        nearestColor = s.color;
      }
    });

    const updated = [
      ...gradientStops,
      { color: nearestColor, stop: percentage },
    ].sort((a, b) => a.stop - b.stop);
    setGradientStops(updated);
    setGradientBg(generateGradientString(updated, gradientAngle));
    const newIndex = updated.findIndex((s) => s.stop === percentage);
    setActiveStopIndex(newIndex >= 0 ? newIndex : 0);
    toast.success("Color stop added!");
  };

  const removeColorStop = (index) => {
    if (gradientStops.length <= 2) {
      toast.error("A gradient needs at least 2 color stops!");
      return;
    }
    const updated = gradientStops.filter((_, i) => i !== index);
    setGradientStops(updated);
    setGradientBg(generateGradientString(updated, gradientAngle));
    
    if (activeStopIndex >= updated.length) {
      setActiveStopIndex(updated.length - 1);
    } else if (activeStopIndex === index && index > 0) {
      setActiveStopIndex(index - 1);
    }
    toast.success("Color stop removed!");
  };

  const handleAngleChange = (angle) => {
    setGradientAngle(angle);
    setGradientBg(generateGradientString(gradientStops, angle));
  };

  const handleModeChange = (mode) => {
    setGradientMode(mode);
    if (mode === "custom") {
      setGradientBg(generateGradientString(gradientStops, gradientAngle));
    } else {
      setGradientBg(backgroundPresets[selectedPresetIndex].value);
    }
  };

  const handlePresetSelect = (index) => {
    const preset = backgroundPresets[index];
    setSelectedPresetIndex(index);
    setGradientBg(preset.value);
    if (!preset.isMesh) {
      setGradientStops(preset.stops);
      setGradientAngle(preset.angle);
      setActiveStopIndex(0);
    }
  };

  const handleTrackClick = (e) => {
    if (e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.min(100, Math.max(0, Math.round((clickX / rect.width) * 100)));
    addColorStopAt(percentage);
  };

  const handlePointerDown = (index, e) => {
    e.preventDefault();
    setActiveStopIndex(index);
    const track = e.currentTarget.parentElement;
    
    const handlePointerMove = (moveEvent) => {
      const rect = track.getBoundingClientRect();
      const x = moveEvent.clientX - rect.left;
      const percentage = Math.min(100, Math.max(0, Math.round((x / rect.width) * 100)));
      
      setGradientStops((prevStops) => {
        const updated = [...prevStops];
        updated[index] = { ...updated[index], stop: percentage };
        setGradientBg(generateGradientString(updated, gradientAngle));
        return updated;
      });
    };
    
    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      setGradientStops((prevStops) => {
        const sorted = [...prevStops].sort((a, b) => a.stop - b.stop);
        const draggedColor = prevStops[index].color;
        const draggedStop = prevStops[index].stop;
        const newIndex = sorted.findIndex(s => s.color === draggedColor && s.stop === draggedStop);
        if (newIndex >= 0) {
          setActiveStopIndex(newIndex);
        }
        setGradientBg(generateGradientString(sorted, gradientAngle));
        return sorted;
      });
    };
    
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const theme = {
    light: {
      wrapper: "bg-[#F8F9FA] text-zinc-900",
      heading: "text-zinc-900",
      subtext: "text-zinc-500",
      card: "bg-white border-zinc-200/85 shadow-sm",
      input: "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-400 focus:outline-none",
      button: "bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-200 shadow-sm",
      secondaryBtn: "bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50 transition-all duration-200",
      backLink: "bg-white border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-350",
      badge: "bg-zinc-100 text-zinc-800 border-zinc-200",
      codeBox: "bg-zinc-900 text-zinc-100 border-zinc-800",
    },
    dark: {
      wrapper: "bg-[#090A0F] text-zinc-100",
      heading: "text-zinc-100",
      subtext: "text-zinc-500",
      card: "bg-zinc-900/50 border-zinc-800/85 backdrop-blur-md shadow-md",
      input: "bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-zinc-500 focus:outline-none",
      button: "bg-white text-zinc-900 hover:bg-zinc-100 transition-all duration-200 shadow-sm",
      secondaryBtn: "bg-zinc-800/50 text-zinc-300 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-200",
      backLink: "bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600",
      badge: "bg-zinc-800 text-zinc-300 border-zinc-700",
      codeBox: "bg-black/40 text-emerald-400 border-zinc-800/80 font-mono",
    },
  };

  const t = dark ? theme.dark : theme.light;

  // Generate background style
  const getBackgroundStyle = () => {
    switch (backgroundType) {
      case "solid":
        return { background: solidBgColor };
      case "gradient":
        return { background: gradientBg };
      case "image":
        return imageUrl
          ? { backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
          : { background: gradientBg };
      default:
        return { background: gradientBg };
    }
  };

  // Generate glassmorphism card style
  const getCardStyle = () => {
    const rgbaBackground = hexToRgba(cardColor, bgOpacity);
    const rgbaShadow = hexToRgba(shadowColor, shadowOpacity);

    return {
      background: rgbaBackground,
      backdropFilter: `blur(${blur}px)`,
      WebkitBackdropFilter: `blur(${blur}px)`,
      borderRadius: `${borderRadius}px`,
      border: `${borderThickness}px solid rgba(255, 255, 255, 0.18)`,
      boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${rgbaShadow}`,
    };
  };

  // Generate CSS code
  const generateCSS = () => {
    const rgbaBackground = hexToRgba(cardColor, bgOpacity);
    const rgbaShadow = hexToRgba(shadowColor, shadowOpacity);

    return `/* Glassmorphism Effect */
background: ${rgbaBackground};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${borderRadius}px;
border: ${borderThickness}px solid rgba(255, 255, 255, 0.18);
box-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${rgbaShadow};`;
  };

  // Hex to RGBA converter
  function hexToRgba(hex, alpha) {
    if (!hex || typeof hex !== "string") return `rgba(255, 255, 255, ${alpha})`;
    let cleanHex = hex.trim();
    if (!cleanHex.startsWith("#")) {
      cleanHex = "#" + cleanHex;
    }
    if (cleanHex.length === 4) {
      const r = parseInt(cleanHex[1] + cleanHex[1], 16);
      const g = parseInt(cleanHex[2] + cleanHex[2], 16);
      const b = parseInt(cleanHex[3] + cleanHex[3], 16);
      return `rgba(${isNaN(r) ? 255 : r}, ${isNaN(g) ? 255 : g}, ${isNaN(b) ? 255 : b}, ${alpha})`;
    }
    const r = parseInt(cleanHex.slice(1, 3), 16);
    const g = parseInt(cleanHex.slice(3, 5), 16);
    const b = parseInt(cleanHex.slice(5, 7), 16);
    return `rgba(${isNaN(r) ? 255 : r}, ${isNaN(g) ? 255 : g}, ${isNaN(b) ? 255 : b}, ${alpha})`;
  }

  // Copy CSS to clipboard
  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS());
    toast.success("CSS copied to clipboard!");
  };

  // Randomize settings
  const randomize = () => {
    setBlur(Math.floor(Math.random() * 40));
    setBgOpacity(Math.random());
    setBorderRadius(Math.floor(Math.random() * 50));
    setBorderThickness(Math.floor(Math.random() * 10) + 1);
    setShadowX(Math.floor(Math.random() * 40) - 20);
    setShadowY(Math.floor(Math.random() * 40));
    setShadowBlur(Math.floor(Math.random() * 100));
    setShadowSpread(Math.floor(Math.random() * 40) - 20);
    setShadowOpacity(Math.random());
    setGradientBg(backgroundPresets[Math.floor(Math.random() * backgroundPresets.length)].value);
    toast.success("Settings randomized!");
  };

  return (
    <div className={`min-h-screen ${t.wrapper} px-4 sm:px-6 py-6 sm:py-10 transition-colors duration-300`}>
      <title>CSS Glassmorphism & Box-Shadow Playground — DevTasks</title>
      <meta
        name="description"
        content="Design modern glassmorphism effects with backdrop blur, box shadows, and live CSS export. Fully offline playground."
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Link
            to="/devutilities"
            className={`p-2 rounded-xl border transition-all duration-200 active:scale-95 flex items-center justify-center shrink-0 ${t.backLink}`}
            title="Back to Utilities"
          >
            <FaArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className={`text-xl sm:text-2xl font-semibold tracking-tight ${t.heading}`}>
              CSS Glassmorphism & Box-Shadow Playground
            </h1>
            <p className={`mt-0.5 text-xs sm:text-sm ${t.subtext}`}>
              Design modern frosted-glass effects with backdrop blur, shadows, and live CSS export.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Left: Controls */}
          <div className="space-y-6">
            {/* Glassmorphism Controls */}
            <div className={`rounded-3xl border ${t.card} p-5 sm:p-6 space-y-6`}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                  <FaPalette className="text-purple-500 w-4 h-4" />
                  Glassmorphism Settings
                </h2>
                <button
                  onClick={randomize}
                  className={`px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 ${t.secondaryBtn}`}
                >
                  <FaRandom className="w-3 h-3" /> Random
                </button>
              </div>

              {/* Blur Slider */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex justify-between">
                  <span>Backdrop Blur</span>
                  <span className="font-mono text-zinc-400">{blur}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Background Opacity */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex justify-between">
                  <span>Background Opacity</span>
                  <span className="font-mono text-zinc-400">{bgOpacity.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={bgOpacity}
                  onChange={(e) => setBgOpacity(Number(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Card Color Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Card Base Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={cardColor}
                    onChange={(e) => setCardColor(e.target.value)}
                    className="h-10 w-16 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent p-1 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={cardColor}
                    onChange={(e) => setCardColor(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-xl border text-sm font-mono ${t.input}`}
                  />
                </div>
              </div>

              {/* Border Radius */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex justify-between">
                  <span>Border Radius</span>
                  <span className="font-mono text-zinc-400">{borderRadius}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Border Thickness */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex justify-between">
                  <span>Border Thickness</span>
                  <span className="font-mono text-zinc-400">{borderThickness}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={borderThickness}
                  onChange={(e) => setBorderThickness(Number(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Box Shadow Controls */}
            <div className={`rounded-3xl border ${t.card} p-5 sm:p-6 space-y-6`}>
              <h2 className="text-lg font-semibold tracking-tight">Box Shadow Settings</h2>

              {/* Shadow X Offset */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex justify-between">
                  <span>Offset X</span>
                  <span className="font-mono text-zinc-400">{shadowX}px</span>
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={shadowX}
                  onChange={(e) => setShadowX(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Shadow Y Offset */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex justify-between">
                  <span>Offset Y</span>
                  <span className="font-mono text-zinc-400">{shadowY}px</span>
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={shadowY}
                  onChange={(e) => setShadowY(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Shadow Blur */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex justify-between">
                  <span>Blur Radius</span>
                  <span className="font-mono text-zinc-400">{shadowBlur}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={shadowBlur}
                  onChange={(e) => setShadowBlur(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Shadow Spread */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex justify-between">
                  <span>Spread Radius</span>
                  <span className="font-mono text-zinc-400">{shadowSpread}px</span>
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={shadowSpread}
                  onChange={(e) => setShadowSpread(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Shadow Opacity */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex justify-between">
                  <span>Shadow Opacity</span>
                  <span className="font-mono text-zinc-400">{shadowOpacity.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={shadowOpacity}
                  onChange={(e) => setShadowOpacity(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Shadow Color */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Shadow Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="h-10 w-16 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent p-1 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-xl border text-sm font-mono ${t.input}`}
                  />
                </div>
              </div>
            </div>

            {/* Background Controls */}
            <div className={`rounded-3xl border ${t.card} p-5 sm:p-6 space-y-4`}>
              <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <FaImage className="text-blue-500 w-4 h-4" />
                Preview Background
              </h2>

              <div className="flex gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/50">
                <button
                  onClick={() => setBackgroundType("solid")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    backgroundType === "solid"
                      ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  Solid
                </button>
                <button
                  onClick={() => setBackgroundType("gradient")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    backgroundType === "gradient"
                      ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  Gradient
                </button>
                <button
                  onClick={() => setBackgroundType("image")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    backgroundType === "image"
                      ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  Image
                </button>
              </div>

              {/* Solid Color */}
              {backgroundType === "solid" && (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={solidBgColor}
                    onChange={(e) => setSolidBgColor(e.target.value)}
                    className="h-10 w-16 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent p-1 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={solidBgColor}
                    onChange={(e) => setSolidBgColor(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-xl border text-sm font-mono ${t.input}`}
                  />
                </div>
              )}

              {/* Gradient Presets & Custom Gradient */}
              {backgroundType === "gradient" && (
                <div className="space-y-6">
                  {/* Mode switcher: Presets / Custom */}
                  <div className="flex gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 mb-4">
                    <button
                      type="button"
                      onClick={() => handleModeChange("preset")}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        gradientMode === "preset"
                          ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm"
                          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeChange("custom")}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        gradientMode === "custom"
                          ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm"
                          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      Custom Gradient
                    </button>
                  </div>

                  {/* Presets Grid */}
                  {gradientMode === "preset" && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                        Gradient Presets
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {backgroundPresets.map((preset, i) => (
                          <button
                            key={i}
                            onClick={() => handlePresetSelect(i)}
                            className={`group p-1.5 rounded-xl border transition-all duration-300 ${
                              selectedPresetIndex === i
                                ? "border-purple-500 ring-2 ring-purple-500/20"
                                : "border-zinc-200 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-700"
                            }`}
                          >
                            <div
                              className="h-12 rounded-lg shadow-sm"
                              style={{ background: preset.value }}
                            />
                            <span className="text-[10px] font-bold mt-1.5 block text-center truncate">
                              {preset.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Multi-Stop Gradient Controls */}
                  {gradientMode === "custom" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          Gradient Track (Drag stops, tap track to add)
                        </span>
                        <button
                          type="button"
                          onClick={addColorStop}
                          className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 cursor-pointer border ${t.secondaryBtn}`}
                        >
                          <FaPlus className="w-2.5 h-2.5" /> Add Color
                        </button>
                      </div>

                      {/* Interactive Gradient Track */}
                      <div
                        onClick={handleTrackClick}
                        className="relative h-8 rounded-xl border border-zinc-300 dark:border-zinc-700 cursor-crosshair shadow-inner"
                        style={{
                          background: `linear-gradient(90deg, ${gradientStops.map(s => `${s.color} ${s.stop}%`).join(', ')})`
                        }}
                      >
                        {gradientStops.map((stop, index) => (
                          <div
                            key={index}
                            onPointerDown={(e) => handlePointerDown(index, e)}
                            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5.5 h-5.5 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 active:scale-95 flex items-center justify-center shadow-md ${
                              activeStopIndex === index
                                ? "border-purple-500 scale-110 z-10 ring-2 ring-purple-500/30 ring-offset-2 dark:ring-offset-zinc-900"
                                : "border-white z-0"
                            }`}
                            style={{
                              left: `${stop.stop}%`,
                              backgroundColor: stop.color,
                            }}
                            title={`Stop ${index + 1}: ${stop.color} (${stop.stop}%)`}
                          />
                        ))}
                      </div>

                      {/* Quick-Select Badges */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {gradientStops.map((stop, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveStopIndex(idx)}
                            className={`px-2.5 py-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                              activeStopIndex === idx
                                ? "bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400 shadow-sm"
                                : "bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block shrink-0"
                              style={{ backgroundColor: stop.color }}
                            />
                            Stop {idx + 1} ({stop.stop}%)
                          </button>
                        ))}
                      </div>

                      {/* Selected Stop Settings Card */}
                      {gradientStops[activeStopIndex] && (
                        <div className={`p-4 rounded-2xl border space-y-4 transition-all ${dark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                              Color Stop #{activeStopIndex + 1} Settings
                            </span>
                            {gradientStops.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeColorStop(activeStopIndex)}
                                className="text-red-500 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                                title="Remove Stop"
                              >
                                <FaTrash className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Color Picker & Text input */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                                Color
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={gradientStops[activeStopIndex].color}
                                  onChange={(e) => handleStopColorChange(activeStopIndex, e.target.value)}
                                  className="h-9 w-12 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent p-0.5 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={gradientStops[activeStopIndex].color}
                                  onChange={(e) => handleStopColorChange(activeStopIndex, e.target.value)}
                                  className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono ${t.input}`}
                                />
                              </div>
                            </div>

                            {/* Position slider */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 flex justify-between">
                                <span>Position</span>
                                <span className="font-mono text-zinc-400">{gradientStops[activeStopIndex].stop}%</span>
                              </label>
                              <div className="flex items-center gap-2 pt-1.5">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={gradientStops[activeStopIndex].stop}
                                  onChange={(e) => handleStopPositionChange(activeStopIndex, Number(e.target.value))}
                                  className="w-full accent-purple-500 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Gradient Angle Slider */}
                      <div className="flex flex-col gap-1.5 pt-2">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 flex justify-between">
                          <span>Gradient Angle</span>
                          <span className="font-mono text-zinc-400">{gradientAngle}°</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={gradientAngle}
                          onChange={(e) => handleAngleChange(Number(e.target.value))}
                          className="w-full accent-purple-500 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Image URL */}
              {backgroundType === "image" && (
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL..."
                  className={`w-full px-3 py-2 rounded-xl border text-sm ${t.input}`}
                />
              )}
            </div>
          </div>

          {/* Right: Preview & Code */}
          <div className="space-y-6">
            {/* Live Preview */}
            <div className={`rounded-3xl border ${t.card} p-6 space-y-4`}>
              <h2 className="text-lg font-semibold tracking-tight">Live Preview</h2>

              <div
                className="relative h-80 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner overflow-hidden flex items-center justify-center p-8"
                style={getBackgroundStyle()}
              >
                <div
                  className="w-full max-w-sm p-8 text-center"
                  style={getCardStyle()}
                >
                  <h3 className="text-2xl font-black mb-3 text-white drop-shadow-lg">
                    Glassmorphism
                  </h3>
                  <p className="text-sm text-white/90 mb-4 drop-shadow">
                    This card demonstrates the frosted-glass effect with backdrop blur and custom shadows.
                  </p>
                  <div className="inline-block px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold backdrop-blur-sm">
                    Beautiful UI
                  </div>
                </div>
              </div>
            </div>

            {/* Generated CSS */}
            <div className={`rounded-3xl border ${t.card} p-6 space-y-4`}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Generated CSS</h2>
                <button
                  onClick={copyCSS}
                  className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${t.button}`}
                >
                  <FaCopy className="w-3 h-3" /> Copy CSS
                </button>
              </div>

              <div className="relative">
                <pre className={`p-4 rounded-2xl border text-xs overflow-x-auto whitespace-pre ${t.codeBox}`}>
                  {generateCSS()}
                </pre>
              </div>

              <div className="text-xs text-zinc-500 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                All properties are vendor-prefixed for maximum browser compatibility.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
