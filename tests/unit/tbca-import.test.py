"""Offline parser regression: units, comma decimals, traces and code identity."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("importer", Path(__file__).resolve().parents[2] / "scripts/expand-tbca.py")
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)


class ImportTests(unittest.TestCase):
    def test_selection_requires_complete_word(self):
        self.assertTrue(importer.matches_query("Maçã, Fuji, crua", "maçã"))
        self.assertFalse(importer.matches_query("Macarrão, cozido", "maçã"))

    def page(self, fiber="2,24"):
        rows = [("Energia", "kcal", "109"), ("Proteína", "g", "1,27"),
                ("Carboidrato total", "g", "26,7"), ("Lipídios", "g", "0,19"),
                ("Fibra alimentar", "g", fiber), ("Sódio", "mg", "tr")]
        return ('<strong>Descrição:</strong>Banana, in natura<br>'
                '<input name="cod_produto" value="BRC0006C" />'
                "<table id='tabela1'><th>Unidade (65&nbsp;g)</th>" +
                "".join("<tr>" + "".join("<td>" + c + "</td>" for c in row) + "</tr>" for row in rows) + "</table>")

    def test_decimal_units_and_trace_preserved(self):
        food = importer.parse_food("BRC0006C", "https://www.tbca.net.br/fixture", self.page())
        self.assertEqual(food["protein"], 1.27)
        self.assertEqual(food["fiber"], 2.24)
        self.assertEqual(food["grams"], 100)
        self.assertEqual(food["measures"][0]["grams"], 65)
        self.assertEqual(food["nutrients"]["Sódio:mg"], {"value": None, "unit": "mg", "original": "tr"})

    def test_missing_macro_and_wrong_identity_rejected(self):
        for code, page in [("BRC0006C", self.page("NA")), ("BRC9999C", self.page())]:
            with self.assertRaises(ValueError):
                importer.parse_food(code, "https://www.tbca.net.br/fixture", page)


if __name__ == "__main__":
    unittest.main()
