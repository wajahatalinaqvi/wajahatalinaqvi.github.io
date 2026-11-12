const steps = [
  ["Discover", "Understand the people, the problem, and what success means."],
  ["Plan", "Map the system. Choose tools and boundaries with intent."],
  ["Build", "Create reusable components and clear application logic."],
  ["Test", "Check behavior, accessibility, and performance on real screens."],
  ["Ship", "Review the details, release carefully, and keep improving."],
];
export function Approach() {
  return (
    <section
      className="section approach-section container"
      aria-labelledby="approach-heading"
    >
      <div data-reveal>
        <p className="eyebrow">
          <span />
          How I work
        </p>
        <h2 id="approach-heading">Good work is a process.</h2>
      </div>
      <ol className="approach-steps">
        {steps.map(([name, description], index) => (
          <li key={name} data-reveal>
            <span>0{index + 1}</span>
            <h3>{name}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
