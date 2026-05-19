import { useState } from "react";
import axios from "axios";

const lesionInfo = {
  bcc: {
    title: "Basal Cell Carcinoma (BCC)",
    desc: "A slow-growing skin cancer arising from basal cells. Rarely spreads but requires early treatment to prevent tissue damage.",
  },
  mel: {
    title: "Melanoma",
    desc: "An aggressive form of skin cancer originating from melanocytes. Early detection significantly improves survival.",
  },
  nv: {
    title: "Melanocytic Nevus",
    desc: "Common mole, usually benign. Monitor for asymmetry, border changes, or color variation.",
  },
  akiec: {
    title: "Actinic Keratosis",
    desc: "Pre-cancerous lesion caused by chronic sun exposure. Can develop into squamous cell carcinoma.",
  },
  bkl: {
    title: "Benign Keratosis",
    desc: "Non-cancerous skin growth, often appearing as waxy or rough patches.",
  },
  df: {
    title: "Dermatofibroma",
    desc: "Benign fibrous skin lesion, typically firm and harmless.",
  },
  vasc: {
    title: "Vascular Lesion",
    desc: "Abnormalities in blood vessels such as angiomas or hemangiomas.",
  },
};

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [overlay, setOverlay] = useState(true);
  const [opacity, setOpacity] = useState(60);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/predict/", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const info = result ? lesionInfo[result.predicted_class] : null;

  const getConfidenceLabel = (c) => {
    if (c > 0.8) return "High confidence";
    if (c > 0.6) return "Moderate confidence";
    return "Low confidence – interpret cautiously";
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-5 py-3 border-b border-white/10 bg-white/5 backdrop-blur">
        <h1 className="text-lg font-semibold text-blue-400">DermNet AI</h1>
        <span className="text-xs text-white/50">
          AI-assisted lesion analysis
        </span>
      </nav>

      {/* MAIN */}
      <div className="max-w-5xl mx-auto p-3 grid md:grid-cols-2 gap-3">
        {/* LEFT PANEL */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
          <input
            type="file"
            onChange={handleUpload}
            className="text-sm file:bg-blue-500 file:text-white file:px-3 file:py-1 file:rounded-md"
          />

          {/* IMAGE */}
          {preview ? (
            <div className="relative flex justify-center items-center bg-black/30 rounded-lg p-2 border border-blue-500/20">
              <img src={preview} className="max-h-72 w-auto object-contain" />

              {result && overlay && (
                <img
                  src={`data:image/jpeg;base64,${result.gradcam}`}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ opacity: opacity / 100 }}
                />
              )}
            </div>
          ) : (
            <div className="text-center text-white/40 text-sm py-10">
              Upload an image to begin analysis
            </div>
          )}

          {/* CONTROLS */}
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-500 hover:bg-blue-600 transition hover:scale-[1.02] active:scale-[0.98] text-sm py-2 rounded-lg"
            >
              {loading ? "Analyzing..." : "Predict"}
            </button>

            {result && (
              <button
                onClick={() => setOverlay(!overlay)}
                className="text-xs px-3 border border-white/20 rounded-lg"
              >
                {overlay ? "Overlay ON" : "Overlay OFF"}
              </button>
            )}
          </div>

          {/* OPACITY SLIDER */}
          {result && overlay && (
            <div className="text-xs space-y-1">
              <label className="text-white/50">Overlay Opacity</label>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white/10 border border-white/10 rounded-xl p-3 space-y-3">
          {!result && (
            <div className="text-center text-white/40 text-sm py-10">
              Prediction results will appear here
            </div>
          )}

          {result && (
            <>
              {/* HEADER */}
              <div>
                <h2 className="text-2xl font-semibold text-blue-400">
                  {info?.title}
                </h2>
                <p className="text-sm text-white/50">
                  {(result.confidence * 100).toFixed(2)}% confidence
                </p>
                <p className="text-xs text-white/50">
                  {getConfidenceLabel(result.confidence)}
                </p>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-white/70 leading-relaxed max-w-prose">
                {info?.desc}
              </p>

              {/* WARNING */}
              <div className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 p-2 rounded-lg">
                This is not a medical diagnosis. Consult a dermatologist.
              </div>

              {/* PROBABILITY BARS */}
              <div className="space-y-2">
                {Object.entries(result.all_probabilities).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs uppercase tracking-wide">
                      <span>{key}</span>
                      <span>{(val * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1 rounded">
                      <div
                        className="bg-blue-400 h-1 rounded"
                        style={{ width: `${val * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
