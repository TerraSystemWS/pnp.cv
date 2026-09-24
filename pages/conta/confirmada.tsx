import AccountShell from "../../components/Conta/AccountShell"
import { openLogin } from "../../lib/auth"
import { getLayoutProps } from "../../lib/layoutProps"

// Destino do link de confirmação — o Strapi confirma a conta e redireciona para aqui.
const Confirmada = ({ social, contato, navbar }: any) => (
  <AccountShell social={social} contato={contato} navbar={navbar} title="Conta confirmada">
    <div className="acc-alert acc-alert-ok">
      O seu email foi confirmado. Já pode entrar e candidatar os seus projetos ou votar na votação pública.
    </div>
    <button className="acc-btn" onClick={openLogin}>Entrar →</button>
  </AccountShell>
)

export default Confirmada

export async function getServerSideProps() {
  return { props: await getLayoutProps() }
}
