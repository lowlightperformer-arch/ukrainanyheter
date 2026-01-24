import { GetServerSideProps } from 'next'
export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: '/admin/signin', permanent: false },
})
export default function LoginRedirect(){ return null }
