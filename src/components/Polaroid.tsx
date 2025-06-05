import React from 'react';

interface PolaroidProps {
  imageSrc: string;
  caption?: string;
  width?: number;  // preferred max width in px
  height?: number; // preferred height in px
}

const Polaroid: React.FC<PolaroidProps> = ({
  imageSrc,
  caption,
  width = 300,
  height = 200,
}) => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: width,
        backgroundColor: '#fff',
        padding: 15,
        paddingBottom: 60, // space for caption
        boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
        borderRadius: 8,
        textAlign: 'center',
        fontFamily: "'Courier New', Courier, monospace",
        userSelect: 'none',
        cursor: 'default',
        boxSizing: 'border-box',
      }}
    >
      <img
        src={imageSrc}
        alt={caption}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: height,
          objectFit: 'cover',
          borderRadius: 6,
          display: 'block',
        }}
      />
      {caption && (
        <div
          style={{
            marginTop: 12,
            color: '#333',
            fontSize: 16,
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

export default Polaroid;