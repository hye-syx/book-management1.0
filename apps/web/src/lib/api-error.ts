export type ApiErrorResponse = {
  message: string;
};

export const throwApiError = async (
  response: Response,
  fallbackMessage: string,
): Promise<never> => {
  const data = (await response.json()) as ApiErrorResponse;
  throw new Error(data.message || fallbackMessage);
};
