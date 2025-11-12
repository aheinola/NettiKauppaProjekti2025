import './LoginPage.css'

function LoginPage() {

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href="/"
    }
  }
  const dontWork = (e) => {
    e.preventDefault()
    alert("invalid credentials" )
  }

  return (
    <div>
      <section class="login-hero">
        <div class="login-container">
          <h1>Log in</h1>
          <p>Please sign in to your account</p>
          <form class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" required />
            </div>
            <button className="login-button" type="submit" onClick={dontWork}>Login</button>
            <button className='back-button' onClick={goBack}>Back</button>
            <div class="extra-links">
              <a href="#">Forgot password?</a>
              <a href="#">Create an account</a>
            </div>
          </form>
        </div>
      </section>

    </div>
  )
}

export default LoginPage