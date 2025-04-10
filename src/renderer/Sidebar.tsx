import { useEffect, useRef } from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import {
  Box,
  Badge,
  ListItemText,
  MenuList,
  IconButton,
  Stack,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
  useTheme,
  Button,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useTranslation } from 'react-i18next'
import icon from './static/icon.png'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import useVersion from './hooks/useVersion'
import SessionList from './components/SessionList'
import * as sessionActions from './stores/sessionActions'
import { useAtomValue, useAtom } from 'jotai'
import * as atoms from './stores/atoms'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { useIsSmallScreen, useSidebarWidth } from './hooks/useScreenChange'
import { trackingEvent } from './packages/event'
import { PanelLeftClose } from 'lucide-react'
import { useNavigate, useRouterState } from '@tanstack/react-router'

export default function Sidebar(props: {}) {
  const language = useAtomValue(atoms.languageAtom)
  const [showSidebar, setShowSidebar] = useAtom(atoms.showSidebarAtom)
  const routerState = useRouterState()

  const sessionListRef = useRef<HTMLDivElement>(null)

  const sidebarWidth = useSidebarWidth()

  // 小屏幕切换会话时隐藏侧边栏
  const isSmallScreen = useIsSmallScreen()
  useEffect(() => {
    if (isSmallScreen) {
      setShowSidebar(false)
    }
  }, [isSmallScreen, routerState.location.pathname])

  const theme = useTheme()

  return (
    <div>
      <SwipeableDrawer
        anchor={language === 'ar' ? 'right' : 'left'}
        variant={isSmallScreen ? 'temporary' : 'persistent'}
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
        onOpen={() => setShowSidebar(true)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sidebarWidth,
          },
        }}
        SlideProps={language === 'ar' ? { direction: 'left' } : undefined}
        PaperProps={language === 'ar' ? { sx: { direction: 'rtl' } } : undefined}
      >
        <div className="ToolBar h-full">
          <Stack
            className="pt-3 pl-2 pr-1"
            sx={{
              height: '100%',
            }}
          >
            <Box className="flex justify-between items-center p-0 m-0 mx-2 mb-2">
              <Box>
                <a href="https://chatboxai.app" target="_blank">
                  <img src={icon} className="w-6 h-6 mr-2 align-middle inline-block" />
                  <span className="text-xl font-semibold align-middle inline-block opacity-75">Chatbox</span>
                </a>
              </Box>
              <Box onClick={() => setShowSidebar(!showSidebar)}>
                <IconButton
                  sx={
                    isSmallScreen
                      ? {
                          borderColor: theme.palette.action.hover,
                          borderStyle: 'solid',
                          borderWidth: 1,
                        }
                      : {}
                  }
                >
                  <PanelLeftClose size="20" strokeWidth={1.5} />
                </IconButton>
              </Box>
            </Box>

            <SessionList sessionListRef={sessionListRef} />

            <Divider variant="fullWidth" />

            <Box sx={isSmallScreen ? {} : { marginBottom: '20px' }}>
              <SidebarButtons sessionListRef={sessionListRef} />
            </Box>
          </Stack>
        </div>
      </SwipeableDrawer>
    </div>
  )
}

function SidebarButtons(props: { sessionListRef: React.RefObject<HTMLDivElement> }) {
  const { sessionListRef } = props
  const { t } = useTranslation()
  const versionHook = useVersion()
  const handleCreateNewSession = () => {
    sessionActions.createEmpty('chat')
    if (sessionListRef.current) {
      sessionListRef.current.scrollTo(0, 0)
    }
    trackingEvent('create_new_conversation', { event_category: 'user' })
  }
  const handleCreateNewPictureSession = () => {
    sessionActions.createEmpty('picture')
    if (sessionListRef.current) {
      sessionListRef.current.scrollTo(0, 0)
    }
    trackingEvent('create_new_picture_conversation', { event_category: 'user' })
  }

  const routerState = useRouterState()
  const navigate = useNavigate()

  return (
    <MenuList>
      <Box className="flex flex-col m-1 mb-2 gap-2">
        <Button variant="contained" className="w-full gap-2" size="large" onClick={handleCreateNewSession}>
          <AddIcon fontSize="small" />
          <span className="flex flex-col normal-case">
            <span>{t('new chat')}</span>
            <span className="opacity-0 h-0">{t('New Images')}</span>
          </span>
        </Button>

        <Button variant="outlined" className="w-full gap-2 " size="large" onClick={handleCreateNewPictureSession}>
          <AddPhotoAlternateIcon fontSize="small" />
          <span className="flex flex-col normal-case">
            <span className="opacity-0 h-0">{t('new chat')}</span>
            <span>{t('New Images')}</span>
          </span>
        </Button>
      </Box>

      {/* <MenuItem onClick={handleCreateNewSession} sx={{ padding: '0.2rem 0.1rem', margin: '0.1rem' }}>
        <ListItemIcon>
          <IconButton>
            <AddIcon fontSize="small" />
          </IconButton>
        </ListItemIcon>
        <ListItemText>{t('new chat')}</ListItemText>
        <Typography variant="body2" color="text.secondary">
        </Typography>
      </MenuItem>

      <MenuItem onClick={handleCreateNewPictureSession} sx={{ padding: '0.2rem 0.1rem', margin: '0.1rem' }}>
        <ListItemIcon>
          <IconButton>
            <AddPhotoAlternateIcon fontSize="small" />
          </IconButton>
        </ListItemIcon>
        <ListItemText>{t('New Images')}</ListItemText>
        <Typography variant="body2" color="text.secondary">
        </Typography>
      </MenuItem> */}

      <MenuItem
        onClick={() => {
          navigate({
            to: '/copilots',
          })
        }}
        selected={routerState.location.pathname === '/copilots'}
        sx={{ padding: '0.2rem 0.1rem', margin: '0.1rem' }}
      >
        <ListItemIcon>
          <IconButton>
            <SmartToyIcon fontSize="small" />
          </IconButton>
        </ListItemIcon>
        <ListItemText>
          <Typography>{t('My Copilots')}</Typography>
        </ListItemText>
      </MenuItem>

      <MenuItem
        onClick={() => {
          // setOpenSettingDialog('ai')
          navigate({
            to: '/settings',
          })
        }}
        selected={routerState.location.pathname === '/settings'}
        sx={{ padding: '0.2rem 0.1rem', margin: '0.1rem' }}
      >
        <ListItemIcon>
          <IconButton>
            <SettingsIcon fontSize="small" />
          </IconButton>
        </ListItemIcon>
        <ListItemText>{t('settings')}</ListItemText>
        <Typography variant="body2" color="text.secondary">
          {/* ⌘N */}
        </Typography>
      </MenuItem>

      <MenuItem
        onClick={() => {
          navigate({
            to: '/about',
          })
        }}
        selected={routerState.location.pathname === '/about'}
        sx={{ padding: '0.2rem 0.1rem', margin: '0.1rem' }}
      >
        <ListItemIcon>
          <IconButton>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </ListItemIcon>
        <ListItemText>
          <Badge color="primary" variant="dot" invisible={!versionHook.needCheckUpdate} sx={{ paddingRight: '8px' }}>
            <Typography sx={{ opacity: 0.5 }}>
              {t('About')}
              {/\d/.test(versionHook.version) ? `(${versionHook.version})` : ''}
            </Typography>
          </Badge>
        </ListItemText>
      </MenuItem>
    </MenuList>
  )
}
