from django import forms


class PackageCsvUploadForm(forms.Form):
    csv_file = forms.FileField(label="CSV file")

    def clean_csv_file(self):
        uploaded = self.cleaned_data["csv_file"]
        if not (uploaded.name or "").lower().endswith(".csv"):
            raise forms.ValidationError("Please upload a .csv file.")
        return uploaded
