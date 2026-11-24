from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):

    class Meta:
        model = Job
        fields = '__all__'

    def validate(self, data):
        start_date = data.get(
            'start_date',
            getattr(self.instance, 'start_date', None)
        )

        end_date = data.get(
            'end_date',
            getattr(self.instance, 'end_date', None)
        )

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                'end_date': 'End date cannot be earlier than start date.'
            })

        return data