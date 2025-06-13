import React from 'react';
import { countryNames } from './countryNames';

const ProviderCountry = ({ countryCode }) => {
  const country = countryNames[countryCode] || countryCode;

  return (
    <span title={country}>
      {countryCode}
    </span>
  );
};

export default ProviderCountry;