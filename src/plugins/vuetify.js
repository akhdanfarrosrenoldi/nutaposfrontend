import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Material Design 3 theme configuration
const lightTheme = {
  dark: false,
  colors: {
    primary: '#6750A4',
    'primary-darken-1': '#5A3F9A',
    secondary: '#625B71',
    'secondary-darken-1': '#4A4458',
    accent: '#7D5260',
    error: '#BA1A1A',
    warning: '#F2B8B5',
    info: '#2196F3',
    success: '#4CAF50',
    surface: '#FEF7FF',
    'surface-variant': '#E7E0EC',
    'on-surface': '#1C1B1F',
    'on-surface-variant': '#49454F',
    background: '#FFFBFE',
    'on-background': '#1C1B1F'
  }
}

const darkTheme = {
  dark: true,
  colors: {
    primary: '#D0BCFF',
    'primary-darken-1': '#B69DF8',
    secondary: '#CCC2DC',
    'secondary-darken-1': '#B0A7C0',
    accent: '#EFB8C8',
    error: '#FFB4AB',
    warning: '#F2B8B5',
    info: '#2196F3',
    success: '#4CAF50',
    surface: '#141218',
    'surface-variant': '#49454F',
    'on-surface': '#E6E1E5',
    'on-surface-variant': '#CAC4D0',
    background: '#101014',
    'on-background': '#E6E1E5'
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: lightTheme,
      dark: darkTheme
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none;'
    },
    VCard: {
      elevation: 1
    }
  }
})