import { useContext } from 'react'
import { SettingsContext } from '../configs/settingsContext'

export const useSettings = () => useContext(SettingsContext)
