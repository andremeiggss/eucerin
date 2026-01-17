import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-50 flex justify-center items-center border-b-4 border-[#9e1e22]">
      <img 
        src="https://github.com/andremeiggss/henribarrett.site.io/blob/28d4e42eacce843b2658da3ffa3868a75e190fc6/images/logos/eucerin_logo.png?raw=true" 
        alt="Eucerin Logo" 
        className="h-14 md:h-20 object-contain"
      />
    </header>
  );
};