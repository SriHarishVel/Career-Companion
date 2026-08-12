import { useNavigate } from "react-router-dom";
import { journeyService } from "../../services/journeyService";
import JourneyCard from "./components/JourneyCard";
import JourneyProgress from "./components/JourneyProgress";
import TodaysFocus from "./components/TodaysFocus";
import QuickAccess from "./components/QuickAccess";
import "./index.css";

function Home() {
    const navigate = useNavigate();
    const journeyStep = journeyService.getNextStep();

    const {
        primaryGoal,
        secondaryGoals,
        completedSecondaryGoals,
        overallProgress,
        todaysFocus,
        skills,
        resources,
        applications
    } = journeyService.getJourneyOverview();

    function handleContinueJourney() {

        navigate(journeyStep.page, {
            state: {
                fromJourney: true,
                action: journeyStep.action
            }
        });

    }

    return (
        <div className="container">

            <h1>Home</h1>

            <div className="home-grid">

                <JourneyCard
                    primaryGoal={primaryGoal}
                    secondaryGoals={secondaryGoals}
                    completedSecondaryGoals={completedSecondaryGoals}
                    overallProgress={overallProgress}
                    journeyStep={journeyStep}
                    onContinue={handleContinueJourney}
                />

                <JourneyProgress
                    primaryGoal={primaryGoal}
                    secondaryGoals={secondaryGoals}
                    skills={skills}
                    resources={resources}
                    applications={applications}
                />

                <TodaysFocus
                    todaysFocus={todaysFocus}
                    primaryGoal={primaryGoal}
                />
                
                <QuickAccess onNavigate={navigate} />

            </div>

        </div>
    );
}

export default Home;