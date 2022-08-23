import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-solid-svg-icons";

import "./About.css";

export default function About() {
  return (
    <div className="about">
      <section className="about-section">
        <h1 className="aboutTitle">About this website</h1>
        <p>Good ol' react-kanban website.</p>
        <p>
          <b>Technologies used:</b>
        </p>
        <ol className="aboutList">
          <li>
            Create-React-App (Don't use this btw, use something else, like
            Next.js. Please.)
          </li>
          <li>Express</li>
          <li>MySQL</li>
        </ol>
        <p>
          <b>Some packages I enjoyed using:</b>
        </p>
        <ol className="aboutList">
          <li>React-beautiul-dnd</li>
          <li>React-popup</li>
          <li>React-datetime-picker</li>
        </ol>
      </section>

      <section className="socials">
        <h2>Socials</h2>

        <a
          className="socials"
          href="https://github.com/Dirivial"
          target="_blank"
        >
          <div className="socialsLabel">Github</div>
          <img src="/GitHub-Mark-Light-32px.png" alt="image" />
        </a>
      </section>
    </div>
  );
}
