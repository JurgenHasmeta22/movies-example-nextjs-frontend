// ** React Imports
import { useState, Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Header from "../components/Header";
import Footer from "../components/Footer";

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import MuiLink from '@mui/material/Link'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from '../configs/themeConfig'

// ** Layout Import
import BlankLayout from '../components/BlankLayout'

// ** Demo Imports
// import FooterIllustrationsV2 from '../components/FooterIllustrationsV2'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const RegisterV1 = () => {
  // ** States
  const [values, setValues] = useState({
    password: '',
    userName: '',
    email: '',
    showPassword: false
  })

  // ** Hook
  const theme = useTheme()

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const router = useRouter()

  function validateUser() {
    if (localStorage.token) {
      fetch('http://localhost:4000/validate', {
        headers: {
          Authorization: localStorage.token
        }
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.error) {
            console.log(data.error)
          } else {
            router.push('/')
          }
        })
    }
  }

  useEffect(() => {
    validateUser()
  }, [])

  async function handleFormSubmitRegister() {
    const formData = {
      userName: values.userName,
      email: values.email,
      password: values.password
    }

    const res = await axios.post(`http://localhost:4000/sign-up`, formData)

    if (res.data.error) {
      console.log(res.data.error)
    } else {
      localStorage.setItem('token', res.data.token)
      router.push('/')
    }
  }

  return (
    <>
      <Header />
      <Box
        className='content-center'
        sx={{ mt: 10, mb: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Card sx={{ zIndex: 1 }}>
          <CardContent sx={{ p: theme => `${theme.spacing(15.5, 7, 6.5)} !important` }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant='body2'>Sign-up to your account</Typography>
            </Box>
            <form
              noValidate
              autoComplete='off'
              onSubmit={e => {
                e.preventDefault()
                handleFormSubmitRegister()
              }}
            >
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor='auth-register-username'>Username</InputLabel>
                <OutlinedInput
                  label='Username'
                  value={values.userName}
                  id='auth-register-username'
                  type='text'
                  onChange={handleChange('username')}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor='auth-register-email'>Email</InputLabel>
                <OutlinedInput
                  label='email'
                  value={values.email}
                  id='auth-register-email'
                  onChange={handleChange('email')}
                  type='email'
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-register-password'>Password</InputLabel>
                <OutlinedInput
                  label='Password'
                  value={values.password}
                  id='auth-register-password'
                  onChange={handleChange('password')}
                  type={values.showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <Fragment>
                    <span>I agree to </span>
                    <Link href='/' passHref>
                      <Typography
                        variant='body2'
                        component={MuiLink}
                        sx={{ color: 'primary.main' }}
                        onClick={e => e.preventDefault()}
                      >
                        privacy policy & terms
                      </Typography>
                    </Link>
                  </Fragment>
                }
              />
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                Sign up
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ mr: 2, color: 'text.secondary' }}>Already have an account?</Typography>
                <Typography>
                  <Link passHref href='/loginv1'>
                    <Typography component={MuiLink} sx={{ color: 'primary.main' }}>
                      Sign in instead
                    </Typography>
                  </Link>
                </Typography>
              </Box>
              <Divider sx={{ mt: 5, mb: 7.5, '& .MuiDivider-wrapper': { px: 4 } }}>or</Divider>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link href='/' passHref>
                  <IconButton component='a' onClick={e => e.preventDefault()}>
                    <Facebook sx={{ color: '#497ce2' }} />
                  </IconButton>
                </Link>
                <Link href='/' passHref>
                  <IconButton component='a' onClick={e => e.preventDefault()}>
                    <Twitter sx={{ color: '#1da1f2' }} />
                  </IconButton>
                </Link>
                <Link href='/' passHref>
                  <IconButton component='a' onClick={e => e.preventDefault()}>
                    <Github
                      sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]) }}
                    />
                  </IconButton>
                </Link>
                <Link href='/' passHref>
                  <IconButton component='a' onClick={e => e.preventDefault()}>
                    <Google sx={{ color: '#db4437' }} />
                  </IconButton>
                </Link>
              </Box>
            </form>
          </CardContent>
        </Card>
        {/* <FooterIllustrationsV2 /> */}
      </Box>
      <Footer />
    </>
  )
}
RegisterV1.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default RegisterV1
