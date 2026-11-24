
from rest_framework import viewsets, status
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from django_filters.rest_framework import DjangoFilterBackend

from .models import Job
from .serializers import JobSerializer


# -----------------------------------------
# Pagination Configuration
# -----------------------------------------

class JobPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


# -----------------------------------------
# Job ViewSet
# -----------------------------------------

class JobViewSet(viewsets.ModelViewSet):

    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer
    pagination_class = JobPagination

    # Filtering, Searching and Ordering
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    # Exact filtering
    filterset_fields = [
        'status',
        'category',
    ]

    # Search fields
    search_fields = [
        'title',
        'description',
        'city',
        'state',
    ]

    # Ordering fields
    ordering_fields = [
        'created_at',
        'start_date',
        'end_date',
        'title',
    ]

    ordering = ['-created_at']

    # -------------------------------------
    # Custom Filtering
    # -------------------------------------

    def get_queryset(self):

        queryset = super().get_queryset()

        city = self.request.query_params.get('city')
        state = self.request.query_params.get('state')

        if city:
            queryset = queryset.filter(
                city__icontains=city
            )

        if state:
            queryset = queryset.filter(
                state__icontains=state
            )

        return queryset

    # -------------------------------------
    # Duplicate Job API
    # -------------------------------------

    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):

        original_job = self.get_object()

        new_job = Job.objects.get(pk=original_job.pk)

        new_job.pk = None
        new_job._state.adding = True
        new_job.title = f"{original_job.title} (Copy)"

        new_job.save()

        serializer = self.get_serializer(new_job)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    # -------------------------------------
    # Publish Job API
    # -------------------------------------

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):

        job = self.get_object()

        if job.status == 'posted':
            return Response(
                {'message': 'Job is already published.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        job.status = 'posted'
        job.save(update_fields=['status'])

        serializer = self.get_serializer(job)

        return Response({
            'message': 'Job published successfully.',
            'job': serializer.data
        }, status=status.HTTP_200_OK)

    # -------------------------------------
    # Close Job API
    # -------------------------------------

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):

        job = self.get_object()

        if job.status == 'closed':
            return Response(
                {'message': 'Job is already closed.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        job.status = 'closed'
        job.save(update_fields=['status'])

        serializer = self.get_serializer(job)

        return Response({
            'message': 'Job closed successfully.',
            'job': serializer.data
        }, status=status.HTTP_200_OK)

    # -------------------------------------
    # Fill Job API
    # -------------------------------------

    @action(detail=True, methods=['post'])
    def fill(self, request, pk=None):

        job = self.get_object()

        if job.status == 'filled':
            return Response(
                {'message': 'Job is already filled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        job.status = 'filled'
        job.save()

        serializer = self.get_serializer(job)

        return Response({
            'message': 'Job marked as filled successfully.',
            'job': serializer.data
        }, status=status.HTTP_200_OK)


from django.shortcuts import render


def dashboard_page(request):
    return render(request, 'jobs/dashboard.html')