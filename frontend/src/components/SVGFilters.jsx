const SvgFilters = ({ strength = 1.5 }) => {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        {/* Unsharp Mask - El más profesional para mejorar calidad */}
        <filter id="unsharp-mask">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite
            in="SourceGraphic"
            in2="blur"
            operator="arithmetic"
            k1="0"
            k2={1 + strength * 0.3}
            k3={-strength * 0.3}
            k4="0"
            result="unsharp"
          />
        </filter>

        {/* Sharpening balanceado */}
        <filter id="sharpen">
          <feConvolveMatrix
            order="3"
            kernelMatrix={`
              -0.25 -0.5 -0.25
              -0.5 ${3 + strength} -0.5
              -0.25 -0.5 -0.25
            `}
            preserveAlpha="true"
          />
        </filter>

        {/* Filtro de claridad para mejor contraste local */}
        <filter id="clarity">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite
            in="SourceGraphic"
            in2="blur"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="-0.5"
            k4="0"
            result="highpass"
          />
          <feComposite
            in="SourceGraphic"
            in2="highpass"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3={strength * 0.2}
            k4="0"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default SvgFilters;