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
import { getNewsCategoryById, updateNewsCategoryById } from 'apiSdk/news-categories';
import { Error } from 'components/error';
import { newsCategoryValidationSchema } from 'validationSchema/news-categories';
import { NewsCategoryInterface } from 'interfaces/news-category';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function NewsCategoryEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<NewsCategoryInterface>(
    () => (id ? `/news-categories/${id}` : null),
    () => getNewsCategoryById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: NewsCategoryInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateNewsCategoryById(id, values);
      mutate(updated);
      resetForm();
      router.push('/news-categories');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<NewsCategoryInterface>({
    initialValues: data,
    validationSchema: newsCategoryValidationSchema,
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
            Edit News Category
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
            <FormControl id="category_name" mb="4" isInvalid={!!formik.errors?.category_name}>
              <FormLabel>Category Name</FormLabel>
              <Input
                type="text"
                name="category_name"
                value={formik.values?.category_name}
                onChange={formik.handleChange}
              />
              {formik.errors.category_name && <FormErrorMessage>{formik.errors?.category_name}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'editor_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
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
  entity: 'news_category',
  operation: AccessOperationEnum.UPDATE,
})(NewsCategoryEditPage);
