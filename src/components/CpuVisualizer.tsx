import React, { useEffect, useState } from 'react'
import {
  Box, Grid, Paper, Typography, Button, TextField, Stack,
  Slider,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import MemoryIcon from '@mui/icons-material/Storage'
import CodeIcon from '@mui/icons-material/Code'
import BoltIcon from '@mui/icons-material/Bolt'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import Draggable from 'react-draggable'
import VideoLink from './VideoLink'

type Phase = 'idle' | 'fetch' | 'decode' | 'execute'

interface Instruction {
  id: number
  text: string
}

const phaseOrder: Phase[] = ['fetch', 'decode', 'execute']

export default function CpuVisualizer() {
  const [instructions, setInstructions] = useState<Instruction[]>([
    { id: 0, text: 'LOAD 10' },
    { id: 1, text: 'ADD 11' },
    { id: 2, text: 'STORE 12' },
    { id: 3, text: 'JMP 5' },
    { id: 4, text: 'NOP' },
    { id: 5, text: 'LOAD 13' },
    { id: 10, text: 'DATA 7' },
    { id: 11, text: 'DATA 3' },
    { id: 12, text: 'DATA 0' },
    { id: 13, text: 'DATA 42' }
  ])
  const [pc, setPc] = useState(0)
  const [ir, setIr] = useState<string>('')
  const [acc, setAcc] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(700)
  const [newInstruction, setNewInstruction] = useState('')

  useEffect(() => {
    if (!running) return

    const timer = setTimeout(() => {
      step()
    }, speed)

    return () => clearTimeout(timer)
  }, [running, phase, pc, ir, acc])

  function resetAll() {
    setRunning(false)
    setPc(0)
    setIr('')
    setAcc(0)
    setPhase('idle')
  }

  function getInstructionAtPc(pc: number): Instruction | undefined {
    return instructions.find(i => i.id === pc)
  }

  function step() {
    if (phase === 'idle') {
      // Começa ciclo com fetch da instrução no PC
      const inst = getInstructionAtPc(pc)
      setIr(inst ? inst.text : 'NOP')
      setPhase('fetch')
      return
    }
    if (phase === 'fetch') {
      setPhase('decode')
      return
    }
    if (phase === 'decode') {
      setPhase('execute')
      return
    }
    if (phase === 'execute') {
      // Executa a instrução
      const parts = ir.trim().split(/\s+/)
      const op = parts[0]?.toUpperCase() ?? 'NOP'
      const arg = parts[1] ? parseInt(parts[1], 10) : undefined

      if (op === 'LOAD') {
        const mem = getInstructionAtPc(arg ?? -1)
        const val = mem && mem.text.startsWith('DATA') ? parseInt(mem.text.split(/\s+/)[1], 10) : 0
        setAcc(val)
        setPc(p => p + 1)
      } else if (op === 'ADD') {
        const mem = getInstructionAtPc(arg ?? -1)
        const val = mem && mem.text.startsWith('DATA') ? parseInt(mem.text.split(/\s+/)[1], 10) : 0
        setAcc(a => a + val)
        setPc(p => p + 1)
      } else if (op === 'STORE') {
        const target = arg ?? -1
        setInstructions(prev => {
          const idx = prev.findIndex(i => i.id === target)
          if (idx >= 0) {
            const copy = [...prev]
            copy[idx] = { ...copy[idx], text: `DATA ${acc}` }
            return copy
          } else {
            return [...prev, { id: target, text: `DATA ${acc}` }]
          }
        })
        setPc(p => p + 1)
      } else if (op === 'JMP') {
        if (arg !== undefined) {
          setPc(arg)
        } else {
          setPc(p => p + 1)
        }
      } else if (op === 'NOP') {
        setPc(p => p + 1)
      } else {
        setPc(p => p + 1)
      }

      setPhase('idle')
      return
    }
  }

  function addInstruction() {
    const trimmed = newInstruction.trim()
    if (!trimmed) return
    setInstructions(prev => {
      const maxId = prev.reduce((acc, i) => Math.max(acc, i.id), -1)
      return [...prev, { id: maxId + 1, text: trimmed }]
    })
    setNewInstruction('')
  }

  const phaseColor = (p: Phase) => {
    if (p === 'fetch') return '#2196f3'
    if (p === 'decode') return '#ff9800'
    if (p === 'execute') return '#4caf50'
    return '#9e9e9e'
  }

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: 460,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                overflowY: 'auto',
                gap: 1,
                paddingRight: 1,
                border: '1px solid #ddd',
                borderRadius: 2,
                backgroundColor: '#f9f9f9'
              }}
            >
              {instructions.map(inst => {
                const isActive = inst.id === pc
                return (
                  <Paper
                    key={inst.id}
                    elevation={isActive ? 6 : 1}
                    sx={{
                      p: 1.5,
                      cursor: 'default',
                      border: isActive ? `2px solid ${phaseColor(phase)}` : '1px solid #ccc',
                      backgroundColor: isActive ? '#e3f2fd' : '#fff',
                      userSelect: 'none',
                      textAlign: 'left',
                      fontFamily: 'monospace',
                      transition: 'background-color 0.3s ease, border-color 0.3s ease'
                    }}
                  >
                    <Typography variant="subtitle2" noWrap>
                      #{inst.id}
                    </Typography>
                    <Typography variant="body1">
                      {inst.text}
                    </Typography>
                  </Paper>
                )
              })}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box
              sx={{
                height: 460,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              
              <Box
                sx={{
                  width: 320,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                  padding: 3,
                  userSelect: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
                  CPU
                </Typography>

                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-around',
                    gap: 2,
                  }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: 2,
                      borderRadius: 2,
                      backgroundColor: '#fafafa',
                      border: '2px solid #2196f3',
                    }}
                  >
                    <MemoryIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      IR (Instr. Reg.)
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: 'monospace', userSelect: 'text', mt: 0.5 }}
                    >
                      {ir || '(—)'}
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={4}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: 2,
                      borderRadius: 2,
                      backgroundColor: '#fafafa',
                      border: '2px solid #4caf50',
                    }}
                  >
                    <SettingsEthernetIcon sx={{ fontSize: 40, mb: 1, color: '#4caf50' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      ACC (Acumulador)
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: 'monospace', userSelect: 'text', mt: 0.5 }}
                    >
                      {acc}
                    </Typography>
                  </Paper>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 3,
                  mb: 3
                }}
              >
                <Stack direction="column" spacing={1} alignItems="center" mb={2}>
  <Typography variant="subtitle1">
    Tempo de clock: {speed} ms
  </Typography>
  <Slider
    value={speed}
    onChange={(e, val) => setSpeed(val as number)}
    aria-labelledby="clock-speed-slider"
    valueLabelDisplay="auto"
    step={50}
    min={100}
    max={2000}
    sx={{ width: 300 }}
  />
</Stack>
                {phaseOrder.map((p, idx) => {
                  const active = phase === p
                  return (
                    <Box
                      key={p}
                      sx={{
                        width: 120,
                        height: 90,
                        borderRadius: 2,
                        backgroundColor: active ? `${phaseColor(p)}22` : '#fff',
                        border: `2px solid ${active ? phaseColor(p) : '#ddd'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: active ? phaseColor(p) : 'rgba(0,0,0,0.6)',
                        userSelect: 'none',
                        fontWeight: active ? 'bold' : 'normal',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {p === 'fetch' && <MemoryIcon sx={{ fontSize: 36 }} />}
                      {p === 'decode' && <CodeIcon sx={{ fontSize: 36 }} />}
                      {p === 'execute' && <BoltIcon sx={{ fontSize: 36 }} />}
                      <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        {p.toUpperCase()}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>

              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <TextField
                  label="Nova instrução"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={newInstruction}
                  onChange={e => setNewInstruction(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      addInstruction()
                    }
                  }}
                />
                <Button variant="contained" onClick={addInstruction}>
                  Adicionar
                </Button>
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
                <Button
                  startIcon={<PlayArrowIcon />}
                  variant="contained"
                  onClick={() => setRunning(true)}
                  disabled={running}
                >
                  Executar
                </Button>
                <Button
                  startIcon={<PauseIcon />}
                  variant="outlined"
                  onClick={() => setRunning(false)}
                  disabled={!running}
                >
                  Pausar
                </Button>
                <Button
                  startIcon={<SkipNextIcon />}
                  variant="outlined"
                  onClick={() => {
                    step()
                    setRunning(false)
                  }}
                >
                  Próximo Passo
                </Button>
                <Button
                  startIcon={<RestartAltIcon />}
                  variant="outlined"
                  onClick={resetAll}
                >
                  Reiniciar
                </Button>
              </Stack>

                  

              <Draggable handle=".drag-handle">
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#f9f9f9',
                    userSelect: 'none',
                    width: 320,
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    zIndex: 9999,
                    boxShadow: 3,
                  }}
                >
                  {/* Barra de título para arrastar */}
                  <Box
                    className="drag-handle"
                    sx={{
                      cursor: 'move',
                      backgroundColor: '#1976d2',
                      color: '#fff',
                      px: 2,
                      py: 1,
                      borderRadius: '6px 6px 0 0',
                      fontWeight: 'bold',
                      userSelect: 'none',
                      mb: 1,
                      fontSize: '1.1rem',
                    }}
                  >
                    Console da CPU
                  </Box>

                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {`PC: ${pc}\nIR: ${ir || '(—)'}\nACC: ${acc}\nFase: ${phase.toUpperCase()}`}
                  </Typography>
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <VideoLink />
                  </Box>
                </Paper>
              </Draggable>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
