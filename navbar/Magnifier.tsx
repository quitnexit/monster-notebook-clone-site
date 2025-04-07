import React, { useRef, useEffect, useState } from "react";

interface MagnifierProps {
  src: string;
  zoomLevel?: number;
}

const Magnifier: React.FC<MagnifierProps> = ({ src, zoomLevel = 2 }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = imgRef.current;
    const lens = lensRef.current;

    if (!img || !lens) return;

    const updateSize = () => {
      setImgSize({ width: img.width, height: img.height });
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    const moveLens = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();

      const pos = getCursorPos(e, img);
      let x = pos.x;
      let y = pos.y;

      const lensSize = lens.offsetWidth / 2;
      if (x > img.width - lensSize / zoomLevel) x = img.width - lensSize / zoomLevel;
      if (x < lensSize / zoomLevel) x = lensSize / zoomLevel;
      if (y > img.height - lensSize / zoomLevel) y = img.height - lensSize / zoomLevel;
      if (y < lensSize / zoomLevel) y = lensSize / zoomLevel;

      lens.style.left = `${x - lensSize}px`;
      lens.style.top = `${y - lensSize}px`;
      lens.style.backgroundPosition = `-${(x * zoomLevel) - lensSize}px -${(y * zoomLevel) - lensSize}px`;
    };

    const getCursorPos = (e: MouseEvent | TouchEvent, img: HTMLImageElement) => {
      const rect = img.getBoundingClientRect();
      let x = (("touches" in e ? e.touches[0].pageX : e.pageX) - rect.left) - window.scrollX;
      let y = (("touches" in e ? e.touches[0].pageY : e.pageY) - rect.top) - window.scrollY;
      return { x, y };
    };

    img.addEventListener("mousemove", moveLens);
    img.addEventListener("touchmove", moveLens);
    lens.addEventListener("mousemove", moveLens);
    lens.addEventListener("touchmove", moveLens);

    return () => {
      window.removeEventListener("resize", updateSize);
      img.removeEventListener("mousemove", moveLens);
      img.removeEventListener("touchmove", moveLens);
      lens.removeEventListener("mousemove", moveLens);
      lens.removeEventListener("touchmove", moveLens);
    };
  }, [zoomLevel]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img ref={imgRef} src={src} alt="Zoomable" style={{ width: "100%", maxWidth: "600px" }} />
      <div
        ref={lensRef}
        style={{
          position: "absolute",
          border: "3px solid #000",
          borderRadius: "50%",
          cursor: "none",
          width: "100px",
          height: "100px",
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${imgSize.width * zoomLevel}px ${imgSize.height * zoomLevel}px`,
        }}
      />
    </div>
  );
};

export default Magnifier;
