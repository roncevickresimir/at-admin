import { t } from "i18next";

import { apiUrl, baseService } from "../app/baseService";
import { HttpMethods } from "../lookups/httpMethods";
import IQuest from "../interfaces/IQuest";
import { isConstructorDeclaration } from "typescript";

const URL = "/quest";

export interface IGetQuestsPayload {
  search: string;
  page: number;
  rpp: number;
}
interface IQuestResponse {
  id: string;
  title: string;
  description: string;
  categoryIds: number[];
  userId: string;
  latitude: number;
  longitude: number;
  disabled: boolean;
  image: string;
  QuestStationRelations: any[];
}
interface ICreateQuest {
  title: string;
  description: string;
  categoryIds: number[];
  userId: string;
  latitude: any;
  longitude: any;
  stationIds: number[];
  disabled: boolean;
  image: string;
}

interface IUpdateQuest {
  id: string;
  title: string;
  description: string;
  categoryIds: number[];
  userId: string;
  latitude: any;
  longitude: any;
  stationIds: number[];
  disabled: boolean;
  image: string;
}

export const questService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getQuests: builder.query<IQuest[], IGetQuestsPayload>({
      query: (data) => ({
        url: `${URL}/?page=${data.page}&rpp=${data.rpp}${
          data.search && "search=" + data.search
        }`,
        method: HttpMethods.GET,
      }),
      transformResponse: (response: IQuestResponse[]) => {
        const quests: IQuest[] = response.map((quest: IQuestResponse) => {
          return {
            id: quest.id,
            name: quest.title,
            description: quest.description,
            categories: quest.categoryIds,
            stations: quest.QuestStationRelations.map((station: any) => {
              const x = station.Station;
              return {
                id: x.id,
                name: x.title,
              };
            }),
            location: { lat: quest.latitude, lng: quest.longitude },
            userId: quest.userId,
            published: !quest.disabled,
            image: apiUrl + "images/" + quest.image,
          };
        });
        return quests;
      },
    }),
    getQuestById: builder.query<IQuest, string>({
      query: (questId) => ({
        url: `${URL}/${questId}`,
      }),
      transformResponse: (response: IQuestResponse) => {
        let s: any[] = [];
        response.QuestStationRelations.forEach((station: any) => {
          const x = station.Station;
          s.push({
            id: x.id,
            name: x.title,
          });
        });
        return {
          id: response.id,
          name: response.title,
          description: response.description,
          categories: response.categoryIds,
          stations: s,
          location: { lat: response.latitude, lng: response.longitude },
          userId: response.userId,
          published: !response.disabled,
          image: apiUrl + "images/" + response.image,
        };
      },
    }),
    createQuest: builder.mutation<void, ICreateQuest>({
      query: (data) => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
          const value = data[key as keyof typeof data];

          Array.isArray(value)
            ? value.forEach((val: any) => {
                formData.append(`${key}`, val);
              })
            : formData.append(`${key}`, value);
        });

        return {
          url: `${URL}/`,
          method: HttpMethods.POST,
          body: formData,
        };
      },
      //invalidatesTags: [''],
    }),
    updateQuest: builder.mutation<void, IUpdateQuest>({
      query: (data) => ({
        url: `${URL}/${data.id}`,
        method: HttpMethods.PUT,
        body: data,
      }),
      //invalidatesTags: [''],
    }),
    deleteQuest: builder.mutation<void, string>({
      query: (questId) => ({
        url: `${URL}/${questId}`,
        method: HttpMethods.DELETE,
      }),
      //invalidatesTags: [''],
    }),
  }),
});

export const {
  useLazyGetQuestsQuery,
  useLazyGetQuestByIdQuery,
  useCreateQuestMutation,
  useUpdateQuestMutation,
  useDeleteQuestMutation,
} = questService;
