import "./CpsFormButtonLoading.css";

export default function CpsFormButtonLoading({ size = 16 }: { size?: number }) {
  return (
    <div 
      className="form--CpsFormButtonLoading" 
      style={{ width: size, height: size }}
    >
      <div className="form--CpsFormButtonLoadingDot"></div>
      <div className="form--CpsFormButtonLoadingDot"></div>
      <div className="form--CpsFormButtonLoadingDot"></div>
    </div>
  );
}