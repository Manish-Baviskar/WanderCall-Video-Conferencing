import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'

export default function LandingPage(){

    const router = useNavigate();
  return (
    <div className='landingPageContainer'>
        <img src="/dots-top.webp" alt="" className="pattern patternTop" />
      
      <img src="/dots-bottom.webp" alt="" className="pattern patternBottom" />
        <nav>
            <div className='navHeader'>
                <h2>
                    WanderCall
                </h2>
            </div>
            <div className='navlist'>
                <p onClick={() => {const randomId = Math.random().toString(36).substring(7);
    
    
    router("/guestMeet?room=" + randomId)}}>Join as Guest</p>
                <p onClick={() => {
                        router("/auth")

                    }}>Register</p>
                <div className="login-btn" role='button' onClick={() => {
                        router("/auth")

                    }}>Login</div>
            </div>
        </nav>

        <div className='landingMainContainer'>
            <div>
                <h1 className='anim-element anim-delay-1'>Wander <span style={{color: '#ffa500'}}>Beyond</span> Borders.</h1>
                <p className="anim-element anim-delay-2">Experience high-quality video calls that make you feel like you’re actually there.</p>
                <div role='button' className="get-started-btn anim-element anim-delay-3"><Link to={"/auth"}>Get Started</Link></div>
            </div>
            <div>
                <img src='/mobile.svg' className="anim-element anim-delay-4"></img>
            </div>
        </div>


    </div>
  )
}
