import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommentsActions } from './comments.actions';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { ApiService } from '@users/core/http';
import { CreateComment } from '../../models/create-comment.model';
import { Comment } from '../../models/user-comment.model';
import { Router } from "@angular/router";
import { Store } from '@ngrx/store';
import { selectQueryParam, selectQueryParams, selectRouteParams } from '@users/core/data-access';

export const publishComment$ = createEffect(
  (actions$ = inject(Actions),
    apiService = inject(ApiService)
  ) => {
    return actions$.pipe(
      ofType(CommentsActions.publishComment),
      switchMap( 
        ({ comment }) => apiService.post<void, CreateComment>('/comments', comment).pipe(
          map(() => CommentsActions.publishCommentSuccess),
          catchError((error) => {
            console.error('Error', error);
            return of(CommentsActions.publishCommentFailed({ error }))
          })
        )
      )
    )
  }, { functional: true, dispatch: false }
)

export const loadComments$ = createEffect(
  (actions$ = inject(Actions),
    apiService = inject(ApiService)) => {
    return actions$.pipe(
      ofType(CommentsActions.loadComments),
      switchMap(
        () => apiService.get<Comment[]>('/comments')
          .pipe(
            map(
              (comments) => CommentsActions.loadCommentsSuccess({ comments })
            ),
            catchError((error) => {
              console.error('Error', error);
              return of(CommentsActions.loadCommentsFailed({ error }))
            })
          )
      )
    )
  }, { functional: true }
)
export const deleteComment$ = createEffect(
  (actions$ = inject(Actions),
    apiService = inject(ApiService)) => {
    return actions$.pipe(
      ofType(CommentsActions.deleteComment),
      switchMap(
        ({id}) => {
          return apiService.delete<number>(`/comments/${id}`).pipe(
            map(
              () => CommentsActions.deleteCommentSuccess({ id })
            ),
            catchError((error) => {
              console.error('Error', error);
              return of(CommentsActions.deleteCommentFailed({error}))
            })
          )
        }
      )
    )
  }, {functional: true}
)
