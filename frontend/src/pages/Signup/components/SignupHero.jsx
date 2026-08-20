import CareerPath from "./CareerPath";

function SignupHero() {
  return (
    <section className="signup-visual">
      <div className="visual-content">
        <span className="visual-label">CAREER COMPANION / 01</span>

        <h1>
          Build the
          <br />
          career
          <br />
          <span>you want.</span>
        </h1>

        <p>
          Set your direction, build the right skills, and turn your next move
          into progress.
        </p>

        <CareerPath />
      </div>
    </section>
  );
}

export default SignupHero;
