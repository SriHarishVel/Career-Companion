import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { journeyService } from "../../services/journeyService";

import LoadingState from "../../components/LoadingState";

import JourneyBanner from "./components/JourneyBanner";
import TodaysFocus from "./components/TodaysFocus";

import "./index.css";

function Home() {

  const navigate = useNavigate();

  const [journey, setJourney] = useState(null);
  const [journeyStep, setJourneyStep] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJourney = async () => {
        try {
            setLoading(true);

            const journeyData =
                await journeyService.getJourney();

            setJourney(journeyData);
            setJourneyStep(journeyData.nextStep);

        } catch (error) {
            console.error(
                "Failed to load career journey:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    loadJourney();
}, []);

  if (loading) {
    return (
      <div className="container">
        <h1>Home</h1>

        <LoadingState message="Loading your career journey..." />
      </div>
    );
  }

  if (!journey || !journeyStep) {
    return (
      <div className="container">
        <h1>Home</h1>

        <p>Unable to load your career journey.</p>
      </div>
    );
  }

  function handleContinueJourney() {
    navigate(journeyStep.page, {
      state: {
        fromJourney: true,
        action: journeyStep.action,
      },
    });
  }

  return (
    <div className="container">
      <h1>Home</h1>

      <div className="home-grid">
        <JourneyBanner
          primaryGoal={journey.primaryGoal}
          secondaryGoals={journey.secondaryGoals}
          skills={journey.skills}
          resources={journey.resources}
          journeyStep={journeyStep}
          applications={journey.applications}
          onContinue={handleContinueJourney}
        />

        <TodaysFocus
          todaysFocus={journey.todaysFocus}
          primaryGoal={journey.primaryGoal}
          onNavigate={navigate}
        />
      </div>
    </div>
  );
}

export default Home;
