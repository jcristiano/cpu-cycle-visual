import React from 'react'
import { CssBaseline, Container, Box, Typography, Paper } from '@mui/material'
import CpuVisualizer from './components/CpuVisualizer'

export default function App() {
  return (
    <>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f5f7fb, #eef3fb)' }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Simulador Visual do Ciclo de Instrução — Fetch → Decode → Execute (Melhorado)
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
              Insira instruções, veja o ciclo passo a passo e acompanhe o console com estado da CPU.
            </Typography>
            <CpuVisualizer />
          </Paper>
        </Container>
      </Box>
    </>
  )
}
