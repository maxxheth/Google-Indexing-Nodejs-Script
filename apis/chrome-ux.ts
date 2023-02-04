const metrics = [
  "largest_contentful_paint",
  "first_contentful_paint",
  "cumulative_layout_shift",
  "first_input_delay",
  "experimental_time_to_first_byte",
  "experimental_interaction_to_next_paint",
];

type FormFactor = "PHONE" | "TABLET" | "DESKTOP";

type MetricsData = string[];

type ResponseRecord = {
  phoneData: Response;
  tabletData: Response;
  desktopData: Response;
};

export const cruxApi = async (
  apiKey: string,
  origin: string
): Promise<ResponseRecord> => {
  const cruxUri = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const genBody = (
    formFactor: FormFactor,
    origin: string,
    metrics: MetricsData
  ) => {
    return {
      body: JSON.stringify({
        formFactor,
        origin,
        metrics,
      }),
    };
  };

  const phoneData = await fetch(cruxUri, {
    headers,
    ...genBody("PHONE", origin, metrics),
  });

  const tabletData = await fetch(cruxUri, {
    headers,
    ...genBody("TABLET", origin, metrics),
  });

  const desktopData = await fetch(cruxUri, {
    headers,
    ...genBody("DESKTOP", origin, metrics),
  });

  return {
    phoneData,
    tabletData,
    desktopData,
  } satisfies ResponseRecord;
};
