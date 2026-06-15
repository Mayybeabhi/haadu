import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function HomePage(){
    const navigate=useNavigate()

    return(
        <div className="page-shell center">
      <div className="big-center-card stack animate-in">
        <img
          src="/haadu-logo.svg"
          alt="haadu"
          style={{
            width: "180px",
            maxWidth: "90%",
            height: "auto",
            display: "block",
            margin: "0 auto 12px auto"
          }}
        />
        <div className="page-title">haadu</div>
        <div className="page-subtitle">
          guess maadu - multiplayer song guessing game
        </div>

        <Card className="stack" style={{ marginTop: 24 }}>
        <Button color="green" onClick={()=> navigate('/guest')}>continue as guest</Button>
        <Button color="white" disabled>
            🔐 login (later)
          </Button>
          <Button color="white" disabled>
            ✍️ sign up (later)
          </Button>
          </Card>
          </div>
          </div>
    )
}