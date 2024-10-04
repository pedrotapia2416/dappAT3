import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

const AT3ToUSDTPrice: React.FC = () => {
  const [price, setPrice] = useState<string | null>(null);

  const fetchMarketPrice = async () => {
    try {
      const response = await fetch(
        'https://api.paraswap.io/prices/?srcToken=0xc2132D05D31c914a87C6611C10748AEb04B58e8F&destToken=0x22a79a08ddb74A9F1A4eBE5da75300Ad9f1AED76&network=137&partner=quickswapv3&includeDEXS=quickswap%2Cquickswapv3%2Cquickswapv3.1%2Cquickperps&srcDecimals=6&destDecimals=18&amount=1000000&side=SELL&maxImpact=15'
      );
      const data = await response.json();

      if (data && data.priceRoute && data.priceRoute.destAmount) {
        // srcAmount es 1 USDT en formato de 6 decimales (1000000 micro USDT), destAmount es el equivalente en AT3
        const destAmount = parseFloat(data.priceRoute.destAmount) / 1e18; // Convertir de Wei a AT3
        const srcAmount = parseFloat(data.priceRoute.srcAmount) / 1e6; // USDT

        // Precio de 1 AT3 en términos de USDT
        const marketPrice = srcAmount / destAmount; // USDT/AT3
        setPrice(marketPrice.toFixed(6)); // Guardar el precio con 6 decimales
      }
    } catch (error) {
      console.error('Error al obtener el precio de AT3:', error);
    }
  };

  useEffect(() => {
    fetchMarketPrice(); // Llamar a la API al montar el componente
  }, []);

  return (
    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
      <Typography variant="body1" sx={{fontWeight:'600'}}>
      1 AT3: {price ? `${price} USDT` : 'Cargando...'}
      </Typography>
    </Box>
  );
};

export default AT3ToUSDTPrice;
