import { t } from "i18next";

import { baseService } from "../app/baseService";
import { HttpMethods } from "../lookups/httpMethods";
import IReward from "../interfaces/IReward";

const URL = "/reward-type";

export interface IGetRewardsPayload {
  search: string;
  page: number;
  rpp: number;
}

interface IUpdateReward {
  id: string;
  name: string;
  description: string;
  stationId: string;
  image: File[];
}

interface IGetRewardResponse {
  id: string;
  name: string;
  description: string;
  stationId: string;
  image: File[];
}

export const stationService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getRewards: builder.query<IReward[], IGetRewardsPayload>({
      query: (data) => ({
        url: `${URL}/?page=${data.page}&rpp=${data.rpp}`,
        method: HttpMethods.GET,
      }),
      transformResponse: (response: IGetRewardResponse[]) => {
        const rewards: IReward[] = response.map((reward) => {
          return {
            id: reward.id,
            name: reward.name,
            description: reward.description,
            stationId: reward.stationId,
            image: reward.image,
          };
        });
        return rewards;
      },
    }),
    getReward: builder.query<IReward, string>({
      query: (rewardId) => ({
        url: `${URL}/${rewardId}`,
        method: HttpMethods.GET,
      }),
    }),
    getRewardById: builder.query<IReward, string>({
      query: (rewardId) => ({
        url: `${URL}/${rewardId}`,
      }),
      transformResponse: (response: IGetRewardResponse) => {
        const reward: IReward = {
          id: response.id,
          name: response.name,
          description: response.description,
          stationId: response.stationId,
          image: response.image,
        };
        return reward;
      },
    }),
    createReward: builder.mutation<void, any>({
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

        formData.append("image", data.image[0]?.path);

        return {
          url: `${URL}/`,
          method: HttpMethods.POST,
          body: formData,
        };
      },
      //invalidatesTags: [''],
    }),
    updateReward: builder.mutation<void, any>({
      query: (data) => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
          const value = data[key as keyof typeof data];

          Array.isArray(value) &&
            key === "image" &&
            value.forEach((val: any) => {
              formData.append(`${key}`, val);
            });
        });

        formData.append("imagePath", data.image[0].path);

        return {
          url: `${URL}/`,
          method: HttpMethods.POST,
          body: formData,
        };
      },
      //invalidatesTags: [''],
    }),
    deleteReward: builder.mutation<void, string>({
      query: (rewardId) => ({
        url: `${URL}/${rewardId}`,
        method: HttpMethods.DELETE,
      }),
      //invalidatesTags: [''],
    }),
  }),
});

export const {
  useLazyGetRewardsQuery,
  useLazyGetRewardByIdQuery,
  useCreateRewardMutation,
  useUpdateRewardMutation,
  useDeleteRewardMutation,
} = stationService;
