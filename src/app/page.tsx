import "./landing.css";

export const metadata = {
  title: "Consensus — Multi-Method Feature Prioritization for Product Managers",
  description:
    "Run your backlog through MoSCoW, RICE, ICE, and Value vs Effort in parallel. One consensus score. One defensible ranking. Fifteen minutes.",
};

export default function LandingPage() {
  return (
    <>
      {/* TAGBAR */}
      <div className="tagbar">
        <div className="tagbar-track">
          <span>MoSCoW</span><span className="dot"> ● </span>
          <span>RICE</span><span className="dot"> ● </span>
          <span>ICE</span><span className="dot"> ● </span>
          <span>Value vs Effort</span><span className="dot"> ● </span>
          <span>Consensus Score</span><span className="dot"> ● </span>
          <span>No Signup</span><span className="dot"> ● </span>
          <span>Free while in MVP</span><span className="dot"> ● </span>
          <span>MoSCoW</span><span className="dot"> ● </span>
          <span>RICE</span><span className="dot"> ● </span>
          <span>ICE</span><span className="dot"> ● </span>
          <span>Value vs Effort</span><span className="dot"> ● </span>
          <span>Consensus Score</span><span className="dot"> ● </span>
          <span>No Signup</span><span className="dot"> ● </span>
          <span>Free while in MVP</span><span className="dot"> ● </span>
        </div>
      </div>

      {/* HERO */}
      <div className="landing-container">
        <section className="hero">
          <div className="hero-meta">
            <span>Vol. 01 · A Prioritization Broadsheet</span>
            <span className="issue">● LIVE · FREE WHILE IN MVP</span>
          </div>

          <div className="hero-grid">
            <div>
              <h1>
                Prioritize your backlog in <em>fifteen&nbsp;minutes</em>—not&nbsp;<span className="strike">four&nbsp;hours</span> of spreadsheet math.
              </h1>
            </div>
            <aside className="hero-aside">
              <p>
                Consensus is the only tool that runs your features through
                <strong> MoSCoW, RICE, ICE, and Value vs Effort</strong>
                {" "}at the same time, then gives you one ranking your CEO
                and your team can actually trust.
              </p>
              <a href="/app" className="cta">
                <span>Start prioritizing</span>
                <span className="arrow">→</span>
              </a>
              <a href="#how" className="cta cta-secondary">See how</a>
            </aside>
          </div>

          <div className="hero-footnote">
            <div className="cell">
              <div className="num">04<span className="unit">methods</span></div>
              <p>MoSCoW · RICE · ICE · Value vs Effort</p>
            </div>
            <div className="cell">
              <div className="num">20<span className="unit">features</span></div>
              <p>Per session — covers a typical sprint or month</p>
            </div>
            <div className="cell">
              <div className="num">15<span className="unit">min</span></div>
              <p>From empty list to an exportable ranking</p>
            </div>
            <div className="cell">
              <div className="num">0<span className="unit">signup</span></div>
              <p>No accounts. No email walls. Open the page, work.</p>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION: CORE PROMISE */}
      <div className="landing-container">
        <section>
          <div className="sec-head">
            <div className="sec-num">§ 01 — The promise</div>
            <h2 className="sec-title">Finally defend your roadmap with <em>numbers</em>, not&nbsp;gut feelings.</h2>
          </div>

          <div className="benefits">
            <div className="benefit reveal">
              <div className="idx">/01 — add</div>
              <h3>Drop in up to <em>twenty features</em></h3>
              <p>Manual, clean, instant. No templates. No formulas. No fighting Google Sheets at 11pm.</p>
            </div>
            <div className="benefit reveal">
              <div className="idx">/02 — method</div>
              <h3>Pick the methods you <em>trust</em></h3>
              <p>One method, two, or all four in parallel. No re-entering data when you switch.</p>
            </div>
            <div className="benefit reveal">
              <div className="idx">/03 — consensus</div>
              <h3>Get one <em>normalized</em> score</h3>
              <p>Every method scaled to 0–100 and averaged, so nothing dominates on raw-number bias alone.</p>
            </div>
            <div className="benefit reveal">
              <div className="idx">/04 — export</div>
              <h3>Walk out with a <em>PDF</em></h3>
              <p>Table plus chart. Stakeholder-ready. Paste straight into Confluence, Notion, or a Slack thread.</p>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION: LIVE PREVIEW */}
      <div className="landing-container">
        <section>
          <div className="sec-head">
            <div className="sec-num">§ 02 — Aha moment</div>
            <h2 className="sec-title">Watch the <em>consensus column</em> light up in under two minutes.</h2>
          </div>

          <div className="demo reveal">
            <div className="demo-header">
              <h3>Q2 Backlog — 5 features, 3 methods</h3>
              <div className="demo-methods">
                <span className="method-chip active">RICE</span>
                <span className="method-chip active">ICE</span>
                <span className="method-chip active">Value vs Effort</span>
                <span className="method-chip">MoSCoW</span>
              </div>
            </div>

            <table className="ranking">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Feature</th>
                  <th>RICE</th>
                  <th>ICE</th>
                  <th>V/E</th>
                  <th>Consensus</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="rank">01</td>
                  <td className="feat">Onboarding checklist redesign</td>
                  <td className="score">92</td>
                  <td className="score">88</td>
                  <td className="score">90</td>
                  <td className="consensus"><span className="bar" style={{width: "132px"}}></span>90.0</td>
                </tr>
                <tr>
                  <td className="rank">02</td>
                  <td className="feat">Billing history export</td>
                  <td className="score">76</td>
                  <td className="score">72</td>
                  <td className="score">80</td>
                  <td className="consensus"><span className="bar" style={{width: "112px"}}></span>76.0</td>
                </tr>
                <tr>
                  <td className="rank">03</td>
                  <td className="feat">Slack notifications</td>
                  <td className="score">54</td>
                  <td className="score">66</td>
                  <td className="score">60</td>
                  <td className="consensus"><span className="bar" style={{width: "88px"}}></span>60.0</td>
                </tr>
                <tr>
                  <td className="rank">04</td>
                  <td className="feat">Team activity dashboard</td>
                  <td className="score">48</td>
                  <td className="score">40</td>
                  <td className="score">44</td>
                  <td className="consensus"><span className="bar" style={{width: "64px"}}></span>44.0</td>
                </tr>
                <tr>
                  <td className="rank">05</td>
                  <td className="feat">Dark mode toggle</td>
                  <td className="score">22</td>
                  <td className="score">18</td>
                  <td className="score">20</td>
                  <td className="consensus"><span className="bar" style={{width: "30px"}}></span>20.0</td>
                </tr>
              </tbody>
            </table>

            <div className="demo-legend">
              <span>★ #1 agreed by all three methods</span>
              <span>Export → PDF · PNG</span>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION: RECOGNIZE */}
      <div className="recognize" id="recognize">
        <div className="landing-container">
          <div className="sec-head">
            <div className="sec-num">§ 03 — Sound familiar?</div>
            <h2 className="sec-title">You want to make <em>strong product decisions</em> and&nbsp;grow into Senior or Lead&nbsp;PM—but the week keeps dragging you back into the&nbsp;same rituals.</h2>
          </div>

          <div className="triggers">
            <div className="trigger reveal">
              <span className="bullet">→</span>
              <p>Sprint planning is <em>Thursday</em>, and you still haven&#39;t ranked 18 ideas?</p>
            </div>
            <div className="trigger reveal">
              <span className="bullet">→</span>
              <p>Your CEO just dropped another &ldquo;<em>let&#39;s just add this</em>&rdquo; into Slack?</p>
            </div>
            <div className="trigger reveal">
              <span className="bullet">→</span>
              <p>Anxious a single RICE score won&#39;t <em>hold up</em> when the eng lead pushes back?</p>
            </div>
            <div className="trigger reveal">
              <span className="bullet">→</span>
              <p>Copy-pasting the same <em>2018 Google Sheets</em> template your manager left behind?</p>
            </div>
            <div className="trigger reveal">
              <span className="bullet">→</span>
              <p>Watching sprints ship the <em>loudest stakeholder&#39;s</em> feature instead of the most valuable one?</p>
            </div>
            <div className="trigger reveal">
              <span className="bullet">→</span>
              <p>Making calls on <em>gut feel</em>—and worried it&#39;ll catch up to you at your next review?</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: HOW IT WORKS */}
      <div className="landing-container" id="how">
        <section>
          <div className="sec-head">
            <div className="sec-num">§ 04 — How it works</div>
            <h2 className="sec-title">How you&#39;ll actually get to a <em>ranked&nbsp;backlog</em>.</h2>
          </div>

          <div className="core-jobs">
            <div className="core-job">
              <div className="cj-label">
                Core Job
                <strong>Sprint-ready in minutes</strong>
              </div>
              <div className="cj-content">
                <h3>&ldquo;I&#39;ve got 15–20 ideas and <em>sprint planning is tomorrow</em>.&rdquo;</h3>
                <ul>
                  <li><span className="step">01 →</span><p><strong>Add features to a clean list</strong> — no hunting for the right spreadsheet tab.</p></li>
                  <li><span className="step">02 →</span><p><strong>Pick the method you trust</strong> (or two, or three, or four) — no religious war over RICE vs ICE.</p></li>
                  <li><span className="step">03 →</span><p><strong>Fill scores in a validated UI</strong> — can&#39;t hit calculate until it&#39;s clean, so no broken formulas at 11pm.</p></li>
                  <li><span className="step">04 →</span><p><strong>Get a sorted table with a consensus column</strong> — one unambiguous ranking to bring to planning.</p></li>
                </ul>
              </div>
            </div>

            <div className="core-job">
              <div className="cj-label">
                Core Job
                <strong>Stakeholder armor</strong>
              </div>
              <div className="cj-content">
                <h3>&ldquo;Stakeholders are <em>pushing their pet features</em>.&rdquo;</h3>
                <ul>
                  <li><span className="step">01 →</span><p><strong>Point at the consensus score</strong> — the conversation stops being about opinions.</p></li>
                  <li><span className="step">02 →</span><p><strong>Show the 2×2 matrix on screen</strong> — a visual they can&#39;t argue with a paragraph.</p></li>
                  <li><span className="step">03 →</span><p><strong>Export the PDF into the thread</strong> — a permanent, share-able source of truth.</p></li>
                </ul>
              </div>
            </div>

            <div className="core-job">
              <div className="cj-label">
                Core Job
                <strong>Method confidence</strong>
              </div>
              <div className="cj-content">
                <h3>&ldquo;I don&#39;t know <em>which method</em> is right for this decision.&rdquo;</h3>
                <ul>
                  <li><span className="step">01 →</span><p><strong>Run the same list through 2+ methods at once</strong> — see where methods agree and where they diverge.</p></li>
                  <li><span className="step">02 →</span><p><strong>Spot the outliers instantly</strong> — #1 in RICE but #8 in Value vs Effort? You know you need a second look.</p></li>
                  <li><span className="step">03 →</span><p><strong>Ship with a consensus-backed call</strong> — fewer second-guesses, faster decisions.</p></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION: POINT B */}
      <div className="pointB">
        <div className="landing-container">
          <section style={{borderBottom: "none", padding: "112px 0"}}>
            <div className="sec-head">
              <div className="sec-num">§ 05 — Point B</div>
              <h2 className="sec-title">Where you&#39;ll <em>land</em>.</h2>
            </div>

            <div className="pointB-grid">
              <div className="pointB-col">
                <h4>How you&#39;ll feel</h4>
                <ul>
                  <li data-n="01/">Walk into planning <em>confident</em>, not anxious — the ranking is already done and defensible.</li>
                  <li data-n="02/">Feel <em>respected</em>, not steamrolled, when stakeholders see structure instead of opinion.</li>
                  <li data-n="03/">Notice your CEO <em>asking you</em> which features matter — because your calls keep holding up.</li>
                </ul>
              </div>
              <div className="pointB-col">
                <h4>What you&#39;ll build</h4>
                <ul>
                  <li data-n="01/">The kind of <em>strong product decisions</em> Senior and Lead PMs are promoted for.</li>
                  <li data-n="02/">A track record of <em>defensible prioritization</em> — the thing that separates PMs who plateau from those who grow.</li>
                  <li data-n="03/">Back to the work that actually ships product — not polishing spreadsheets.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* SECTION: DOUBTS */}
      <div className="landing-container" id="doubts">
        <section>
          <div className="sec-head">
            <div className="sec-num">§ 06 — Still on the fence?</div>
            <h2 className="sec-title">Your <em>doubts</em>, answered.</h2>
          </div>

          <div className="faq-list">
            <div className="faq-item">
              <div className="faq-q">I already do this in a spreadsheet.</div>
              <div className="faq-a">Sure — for <strong>one method</strong>. Try running four methods in parallel in Sheets and see how long it takes. We do it in one UI, with visualizations and an export that&#39;s ready to paste.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Why can&#39;t I save my work?</div>
              <div className="faq-a">The MVP is a <strong>one-shot tool</strong> on purpose — export the PDF and it lives wherever your team already keeps docs. Saving, logins, and shared projects are on the roadmap for paid plans.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Is it really free?</div>
              <div className="faq-a">Yes — <strong>completely free</strong> while we validate the product. No signup. No credit card. No email wall.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Only twenty features per session?</div>
              <div className="faq-a">That covers a typical sprint or monthly planning. Bigger backlogs usually need to be <strong>clustered first</strong> anyway — start with your top 20.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">How do I know the consensus score is fair?</div>
              <div className="faq-a">Every method is <strong>normalized to 0–100</strong> before averaging, so no single method dominates just because its raw numbers are bigger.</div>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION: COMPETITORS */}
      <div className="landing-container" id="competitors">
        <section>
          <div className="sec-head">
            <div className="sec-num">§ 07 — Firing the alternatives</div>
            <h2 className="sec-title">Why this beats your <em>current&nbsp;setup</em>.</h2>
          </div>

          <div className="competitors-grid">
            <div className="competitor">
              <div className="stamp">FIRED</div>
              <h4>vs. <span className="crossed">Google Sheets templates</span></h4>
              <div className="kind">The 2018 classic</div>
              <p>We kill the manual formula-copying, broken references, and ugly tables. You get validation, visualizations, and an export that looks professional out of the box.</p>
            </div>
            <div className="competitor">
              <div className="stamp">FIRED</div>
              <h4>vs. <span className="crossed">Productboard · Airfocus · Ducalis</span></h4>
              <div className="kind">Full roadmap platforms</div>
              <p>They make you commit to a whole suite, seat by seat, at $39+/user/month. We do <em>one job</em>, really fast, no commitment. Keep using whatever you already have for everything else.</p>
            </div>
            <div className="competitor">
              <div className="stamp">FIRED</div>
              <h4>vs. <span className="crossed">Notion databases</span></h4>
              <div className="kind">A list, not a decision</div>
              <p>Notion can hold features, but it can&#39;t run RICE math, draw a 2×2 matrix, or normalize scores across methods. We turn the list into a decision.</p>
            </div>
            <div className="competitor">
              <div className="stamp">FIRED</div>
              <h4>vs. <span className="crossed">&ldquo;I&#39;ll just pick by gut&rdquo;</span></h4>
              <div className="kind">Until someone asks why</div>
              <p>Gut works until an engineering lead or CEO asks <em>&ldquo;why this one?&rdquo;</em> Bring numbers. Bring a chart. Bring a PDF. Win the conversation.</p>
            </div>
          </div>
        </section>
      </div>

      {/* FINAL CTA */}
      <div className="final-cta" id="start">
        <div className="final-cta-inner landing-container">
          <h2>Open the tool. Add your first feature. <em>Ship with&nbsp;confidence.</em></h2>
          <a href="/app" className="cta">
            <span>Start prioritizing</span>
            <span className="arrow">→</span>
          </a>
          <div className="perks">
            <span>No signup</span>
            <span className="sep">◆</span>
            <span>No email</span>
            <span className="sep">◆</span>
            <span>Free while in MVP</span>
          </div>
        </div>
      </div>

      {/* COLOPHON */}
      <div className="landing-container">
        <footer className="colophon">
          <div>
            <div className="logo">Consensus.</div>
          </div>
          <div className="meta-col">
            <span className="label">Issue</span>
            <span>Vol. 01 · MVP edition · 2026</span>
          </div>
          <div className="meta-col">
            <span className="label">Made for</span>
            <span>Product Managers at growing product startups</span>
          </div>
          <div className="meta-col">
            <span className="label">Typography</span>
            <span>Fraunces · IBM Plex Sans · JetBrains Mono</span>
          </div>
        </footer>
      </div>

      {/* Reveal animation script */}
      <LandingScripts />
    </>
  );
}

function LandingScripts() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var io = new IntersectionObserver(function(entries) {
              entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                  entry.target.classList.add('in');
                  io.unobserve(entry.target);
                }
              });
            }, { threshold: 0.15 });
            document.querySelectorAll('.reveal').forEach(function(el, i) {
              el.style.transitionDelay = (i % 4) * 80 + 'ms';
              io.observe(el);
            });
          })();
        `,
      }}
    />
  );
}
