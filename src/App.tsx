import React from 'react'
import { Container, Box, Typography, Paper } from '@mui/material'
import CpuVisualizer from './components/CpuVisualizer'

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fce4e4, #f9d6d5)' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
          {/* Barra de título estilizada em degradê vermelho */}
          <Box
            sx={{
              mb: 4,
              py: 3,
              px: 4,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #d32f2f, #f44336)',
              color: '#fff',
              boxShadow: '0 4px 12px rgb(211 47 47 / 0.5)',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              letterSpacing: '0.05em',
              userSelect: 'none',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Simulador Visual do Ciclo de Instrução
            <Typography
              component="span"
              sx={{
                display: 'block',
                fontWeight: 'normal',
                fontSize: '1rem',
                opacity: 0.85,
                mt: 0.5,
                letterSpacing: 'normal'
              }}
            >
              Fetch → Decode → Execute
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
            Insira instruções, veja o ciclo passo a passo e acompanhe o console com estado da CPU.            
          </Typography>
          
          <CpuVisualizer />
        </Paper>
      </Container>
    </Box>

  )
}
