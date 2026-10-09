import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("review", Path(__file__).resolve().parents[2] / "scripts/review-food-coverage.py")
review = importlib.util.module_from_spec(spec)
spec.loader.exec_module(review)


class CoverageReviewTests(unittest.TestCase):
    def food(self, code, name):
        return {"code": code, "name": name, "url": "https://www.tbca.net.br/fixture", "responseSha256": "fixture"}

    def row(self, name):
        return {"code": "TACO4-001", "name": name, "candidates": [], "fallbackEnabled": False}

    def audit(self, name, foods):
        row = self.row(name)
        return review.audit_row(row, {"url": "https://nepa.unicamp.br/fixture"}, foods)

    def test_recipe_ingredient_never_proves_standalone_coverage(self):
        result = self.audit("Biscoito, doce, maisena", [self.food("BRC1", "Lanche (biscoito, doce, maisena, café)")])
        self.assertEqual(result["status"], "IDENTITY_DECISION_REQUIRED")

    def test_preserves_variety_and_preparation_differences(self):
        result = self.audit("Abobrinha, paulista, crua", [self.food("BRC1", "Abobrinha, italiana, crua, Brasil")])
        self.assertEqual(result["status"], "IDENTITY_DECISION_REQUIRED")
        self.assertIn("paulista", result["reviewedCandidates"][0]["missingDescriptors"])
        cooked = self.audit("Arroz, integral, cru", [self.food("BRC2", "Arroz, integral, cozido")])
        self.assertEqual(cooked["status"], "IDENTITY_DECISION_REQUIRED")

    def test_preposition_and_minute_spelling_do_not_hide_direct_description(self):
        self.assertEqual(self.audit("Palmito, pupunha, em conserva", [self.food("BRC1", "Palmito, pupunha, conserva, drenado, Brasil")])["status"], "DIRECT_DESCRIPTION_FOUND")
        self.assertEqual(self.audit("Ovo, galinha, clara, cozida/10minutos", [self.food("BRC2", "Ovo, galinha, clara, cozida/10 min, s/ sal")])["status"], "DIRECT_DESCRIPTION_FOUND")

    def test_invalid_source_never_enables_fallback(self):
        row = self.row("Peixe, cru")
        result = review.audit_row(row, {"url": "fixture", "compositionIssues": ["negative carbs"]}, [])
        self.assertEqual(result["status"], "TACO_SOURCE_INVALID")
        self.assertFalse(result["fallbackEnabled"])
        self.assertFalse(result["clinicalEquivalenceApproved"])

    def test_requires_complete_unique_inventory(self):
        with self.assertRaises(ValueError):
            review.build_report([], [{"code": "TACO4-001"}], [], {})

    def test_explicit_noun_order_not_synonyms_can_identify_same_family(self):
        result = self.audit("Farinha, de arroz", [self.food("BRC1", "Arroz, farinha, crua, Brasil"), self.food("BRC2", "Farinha, mandioca, torrada")])
        self.assertEqual(result["status"], "DIRECT_DESCRIPTION_FOUND")
        self.assertEqual(result["reviewedCandidates"][0]["code"], "BRC1")
        other = self.audit("Farinha, de trigo", [self.food("BRC3", "Sanduíche, farinha de trigo, c/ sal")])
        self.assertEqual(other["status"], "IDENTITY_DECISION_REQUIRED")


if __name__ == "__main__":
    unittest.main()
