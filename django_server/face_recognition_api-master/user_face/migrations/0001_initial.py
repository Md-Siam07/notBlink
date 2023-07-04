# Generated by Django 4.1.5 on 2023-01-27 21:52

from django.db import migrations, models
import user_face.models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.IntegerField(default=1, primary_key=True, serialize=False),
                ),
                ("username", models.CharField(max_length=50)),
                (
                    "img",
                    models.ImageField(upload_to=user_face.models.user_directory_path),
                ),
                ("face_encoding", models.TextField()),
            ],
        ),
    ]