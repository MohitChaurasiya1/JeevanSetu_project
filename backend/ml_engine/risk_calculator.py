class RiskCalculator:
    @staticmethod
    def calculate_risk_level(probability):
        if probability < 0.3:
            return "LOW"
        elif probability < 0.6:
            return "MODERATE"
        elif probability < 0.85:
            return "HIGH"
        return "CRITICAL"
