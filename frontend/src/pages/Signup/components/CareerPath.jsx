function CareerPath() {
  const steps = [
    {
      number: "01",
      title: "Define",
      description: "Choose your direction",
    },
    {
      number: "02",
      title: "Develop",
      description: "Build the skills you need",
    },
    {
      number: "03",
      title: "Move",
      description: "Turn preparation into opportunity",
    },
  ];

  return (
    <div className="career-path">
      <div className="career-path-line" />

      {steps.map((step, index) => (
        <div
          className={`career-step ${
            index === steps.length - 1 ? "career-step-final" : ""
          }`}
          key={step.number}
        >
          <span className="career-step-number">{step.number}</span>

          <div className="career-step-content">
            <strong>{step.title}</strong>
            <span>{step.description}</span>
          </div>

          {index < steps.length - 1 && (
            <span className="career-step-arrow">↗</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default CareerPath;
