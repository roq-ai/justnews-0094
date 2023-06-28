import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getClientPreferenceById, updateClientPreferenceById } from 'apiSdk/client-preferences';
import { Error } from 'components/error';
import { clientPreferenceValidationSchema } from 'validationSchema/client-preferences';
import { ClientPreferenceInterface } from 'interfaces/client-preference';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ClientInterface } from 'interfaces/client';
import { NewsCategoryInterface } from 'interfaces/news-category';
import { getClients } from 'apiSdk/clients';
import { getNewsCategories } from 'apiSdk/news-categories';

function ClientPreferenceEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ClientPreferenceInterface>(
    () => (id ? `/client-preferences/${id}` : null),
    () => getClientPreferenceById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ClientPreferenceInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateClientPreferenceById(id, values);
      mutate(updated);
      resetForm();
      router.push('/client-preferences');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ClientPreferenceInterface>({
    initialValues: data,
    validationSchema: clientPreferenceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Client Preference
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <AsyncSelect<ClientInterface>
              formik={formik}
              name={'client_id'}
              label={'Select Client'}
              placeholder={'Select Client'}
              fetcher={getClients}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<NewsCategoryInterface>
              formik={formik}
              name={'news_category_id'}
              label={'Select News Category'}
              placeholder={'Select News Category'}
              fetcher={getNewsCategories}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.category_name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'client_preference',
  operation: AccessOperationEnum.UPDATE,
})(ClientPreferenceEditPage);
