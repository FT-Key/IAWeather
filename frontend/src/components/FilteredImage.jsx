import { useId } from 'react';
import SvgFilters from "./SVGFilters";

const FilteredImage = ({ 
  src, 
  alt = "", 
  className = "", 
  width = "100%", 
  height = "100%",
  filter = "sharpen" // permite elegir el filtro
}) => {
  const id = useId(); // ID único para evitar conflictos
  
  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
      role="img"
      aria-label={alt}
    >
      <SvgFilters />
      <image 
        href={src} 
        width="100%" 
        height="100%" 
        filter={`url(#${filter})`}
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
  );
};

export default FilteredImage;