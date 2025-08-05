import { SignInViewPage } from '@/modules/auth/ui/components/views/sign-in-view'
import { siteConfig } from '@/modules/config/site'
import { Metadata } from 'next'

export const metadata : Metadata ={
  title: siteConfig.auth.signIn.title,
  description: siteConfig.auth.signIn.description,
}


export default function Page() {
  return <SignInViewPage />
}