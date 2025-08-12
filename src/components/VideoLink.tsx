import React, { useState } from 'react'
import { Box, Link, Dialog, DialogContent, DialogActions, Button, IconButton, Typography } from '@mui/material'
import YouTubeIcon from '@mui/icons-material/YouTube'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

export default function VideoLink() {
  const [open, setOpen] = useState(false)

  const videoUrl = 'https://www.youtube.com/embed/Z5JC9Ve1sfI'
  const videoPageUrl = 'https://www.youtube.com/watch?v=Z5JC9Ve1sfI'

  return (
    <>
      <Link
        component="button"
        variant="body1"
        onClick={() => setOpen(true)}
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
      >
        <YouTubeIcon color="error" />
        <Typography>Assista o vídeo explicativo</Typography>
      </Link>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent
          sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}
        >
          <iframe
            width="100%"
            height="100%"
            src={videoUrl}
            title="Simulador Ciclo CPU - Vídeo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, borderRadius: 8 }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
          <Button onClick={() => setOpen(false)}>Fechar</Button>
          <Button
            variant="contained"
            color="error"
            endIcon={<OpenInNewIcon />}
            onClick={() => window.open(videoPageUrl, '_blank', 'noopener')}
          >
            Abrir no YouTube
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
