import { t } from "i18next";

import { baseService } from "../app/baseService";
import { HttpMethods } from "../lookups/httpMethods";
import IStation from "../interfaces/IStation";

const URL = "/station";

export interface IGetStationsPayload {
  search: string;
  page: number;
  rpp: number;
}

export interface ICreateStation {
  title: string;
  description: string;
  categoryIds: string[];
  published: boolean;
  premium: boolean;
  images: File[];
  accountId: string;
  latitude: number;
  longitude: number;
}

interface IUpdateStation {
  id: string;
  title: string;
  description: string;
  categoryIds: any;
  published: boolean;
  premium: boolean;
  images: File[];
  accountId: string;
  latitude: number;
  longitude: number;
}

interface IGetStationsResponse {
  id: string;
  title: string;
  description: string;
  categoryIds: string[];
  published: boolean;
  premium: boolean;
  Images: File[];
  account: string;
  latitude: number;
  longitude: number;
}

export const stationService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getStations: builder.query<IStation[], IGetStationsPayload>({
      query: (data) => ({
        url: `${URL}/?page=${data.page}&rpp=${data.rpp}`,
        method: HttpMethods.GET,
      }),
      transformResponse: (response: IGetStationsResponse[]) => {
        const stations: IStation[] = response.map((station) => {
          return {
            id: station.id,
            name: station.title,
            description: station.description,
            categories: station.categoryIds,
            published: station.published,
            premium: station.premium,
            images: station.Images,
            user: station.account,
            location: { lat: station.latitude, lng: station.longitude },
          };
        });
        return stations;
      },
    }),
    getStation: builder.query<IStation, string>({
      query: (stationId) => ({
        url: `${URL}/${stationId}`,
        method: HttpMethods.GET,
      }),
    }),
    getStationById: builder.query<IStation, string>({
      query: (stationId) => ({
        url: `${URL}/${stationId}`,
      }),
      transformResponse: (response: IGetStationsResponse) => {
        const station: IStation = {
          id: response.id,
          name: response.title,
          description: response.description,
          categories: response.categoryIds,
          published: response.published,
          premium: response.premium,
          images: response.Images,
          user: response.account,
          location: { lat: response.latitude, lng: response.longitude },
        };
        return station;
      },
    }),
    createStation: builder.mutation<void, any>({
      query: (data) => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
          const value = data[key as keyof typeof data];

          Array.isArray(value) && key === "images"
            ? value.forEach((val: any) => {
                formData.append(`${key}`, val);
              })
            : key === "categoryIds"
            ? value[0].forEach((val: any) => {
                formData.append(`${key}`, val);
              })
            : formData.append(`${key}`, value);
        });

        formData.append("imagePath", data.images[0].path);

        return {
          url: `${URL}/`,
          method: HttpMethods.POST,
          body: formData,
        };
      },
      //invalidatesTags: [''],
    }),
    updateStation: builder.mutation<void, IUpdateStation>({
      query: (data) => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
          const value = data[key as keyof typeof data];

          Array.isArray(value) && key === "images"
            ? value.forEach((val: any) => {
                formData.append(`${key}`, val);
              })
            : key === "categoryIds"
            ? value[0].forEach((val: any) => {
                formData.append(`${key}`, val);
              })
            : formData.append(`${key}`, value);
        });

        return {
          url: `${URL}/${data.id}`,
          method: HttpMethods.PUT,
          body: formData,
        };
      },
      //invalidatesTags: [''],
    }),
    deleteStation: builder.mutation<void, string>({
      query: (stationId) => ({
        url: `${URL}/${stationId}`,
        method: HttpMethods.DELETE,
      }),
      //invalidatesTags: [''],
    }),
  }),
});

export const {
  useLazyGetStationsQuery,
  useLazyGetStationByIdQuery,
  useCreateStationMutation,
  useUpdateStationMutation,
  useDeleteStationMutation,
} = stationService;
