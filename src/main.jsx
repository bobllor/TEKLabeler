import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TicketProvider } from './context/TicketContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { HashRouter } from 'react-router'
import { AlertsProvider } from './context/AlertsContext.jsx'
import App from './App.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { ModalProvider } from './context/ModalContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <TicketProvider>
        <ThemeProvider>
          <AlertsProvider>
            <SettingsProvider>
              <ModalProvider >
                <HashRouter>
                  <App />
                </HashRouter>
              </ ModalProvider>
            </SettingsProvider>
          </AlertsProvider>
        </ThemeProvider>
      </TicketProvider>
    </DataProvider>
  </StrictMode>,
)
