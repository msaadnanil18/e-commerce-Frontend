import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  XStack,
  Separator,
  YStack,
  ScrollView,
  Paragraph,
  TextArea,
  Button,
  Spinner,
  Avatar,
} from 'tamagui';
import FileUpload from '../appComponets/fileupload/FileUpload';
import useFileUpload from '../appComponets/fileupload/useFileUpload';
import { ServiceErrorManager } from '@/helpers/service';
import {
  AddNewReviewService,
  ListReviewService,
} from '@/services/productReview';
import { IProduct } from '@/types/products';
import { IReview } from '@/types/reviews';
import RenderDriveFile from '../appComponets/fileupload/RenderDriveFile';
import { head, startCase } from 'lodash-es';

const CustomerReviews: FC<{ product: IProduct | null }> = ({ product }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Array<IReview>>([]);

  const fetchReviewList = () => {
    if (product?._id) {
      setLoading(true);
      ServiceErrorManager(ListReviewService(product?._id)(), {})
        .then(([_, data]) => setReviews(data.docs))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchReviewList();
  }, []);

  const RenderStartReatign = useMemo(
    () => <StarRating product={product} fetchReviewList={fetchReviewList} />,
    []
  );
  return (
    <View flex={1} flexDirection='row' padding='$10' gap='$10'>
      <View>
        <Text fontSize='$5' fontWeight='bold'>
          Customer Reviews
        </Text>
        <Separator />
        <YStack space='$4' className='mt-4'>
          {reviews.map((review) => (
            <XStack key={review._id} space='$2' className='border-b'>
              <Avatar circular size='$2' backgroundColor='$blue5'>
                <Text color='$blue11' fontSize='$4'>
                  {head(startCase(review.customer.name))}
                </Text>
              </Avatar>

              <YStack>
                <Text fontWeight='bold'>{review.customer.name}</Text>
                <Paragraph fontSize='$4' className='text-gray-600'>
                  {review.comment}
                </Paragraph>

                <ScrollView
                  horizontal
                  //showsVerticalScrollIndicator={false}
                  style={{ maxWidth: 500 }}
                >
                  {review.attachments.map((i, index) => (
                    <View
                      key={index}
                      flexDirection='row'
                      alignItems='center'
                      marginBottom='$2'
                      padding='$4'
                    >
                      <RenderDriveFile
                        file={i}
                        style={{ height: 100, width: 100 }}
                      />
                    </View>
                  ))}
                </ScrollView>
              </YStack>
            </XStack>
          ))}
        </YStack>
      </View>

      <View flex={1}>
        <View>
          <XStack>
            <Text fontSize='$5' fontWeight='bold'>
              Leave a Review Rating
            </Text>
          </XStack>

          <YStack space='$4' className='mt-4'>
            {RenderStartReatign}
          </YStack>
        </View>
      </View>
    </View>
  );
};

export default CustomerReviews;

const StarRating: FC<{
  product: IProduct | null;
  fetchReviewList: () => void;
}> = React.memo(({ product, fetchReviewList }) => {
  const { getFileUpload } = useFileUpload();
  const fileUploadRef = useRef<{ resetFile: () => void }>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newReview, setNewReview] = useState('');
  const [reviewImage, setReviewImage] = useState<Array<File>>([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleAddReview = async () => {
    setIsSubmitting(true);
    const uploadedFile = await getFileUpload(reviewImage);
    await ServiceErrorManager(
      AddNewReviewService({
        data: {
          payload: {
            product: product?._id,
            comment: newReview,
            attachments: uploadedFile,
            rating,
          },
        },
      }),
      {}
    );
    setIsSubmitting(false);
    setNewReview('');
    setRating(0);
    fileUploadRef.current?.resetFile();
    fetchReviewList();
  };
  return (
    <YStack alignItems='center' width='100%'>
      <XStack marginBottom='$4'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            unstyled
            fontSize={32}
            marginHorizontal='$1'
            color={(hover || rating) >= star ? '$yellow10' : '$gray5'}
            onPress={() => handleClick(star)}
            onHoverIn={() => setHover(star)}
            onHoverOut={() => setHover(0)}
            accessibilityLabel={`Rate ${star} stars`}
            pressStyle={{
              scale: 1.1,
            }}
            hoverStyle={{
              scale: 1.1,
            }}
          >
            ★
          </Button>
        ))}
      </XStack>

      <YStack height={24} justifyContent='center'>
        {rating > 0 && (
          <Text color='$gray11'>
            You rated this {rating} {rating === 1 ? 'star' : 'stars'}
          </Text>
        )}
        {!rating && hover > 0 && (
          <Text color='$gray9'>
            Rate {hover} {hover === 1 ? 'star' : 'stars'}
          </Text>
        )}
      </YStack>

      {rating > 0 && (
        <YStack marginTop='$4' width='100%'>
          <FileUpload
            fileUploadRef={fileUploadRef}
            onFileChange={(e) => setReviewImage(e)}
          />
          <TextArea
            width='100%'
            padding='$3'
            value={newReview}
            onChangeText={(e) => setNewReview(e)}
            marginTop='$3'
            borderWidth={1}
            borderColor='$gray6'
            borderRadius='$3'
            focusStyle={{
              borderColor: '$blue8',
              borderWidth: 2,
            }}
            placeholder='Share your experience (optional)'
          />
          <Button
            onPress={handleAddReview}
            disabled={newReview.trim() === '' || isSubmitting}
            marginTop='$3'
            width='100%'
            icon={isSubmitting ? <Spinner /> : null}
            backgroundColor='$primary'
            color='white'
            fontWeight='500'
            paddingVertical='$2'
            paddingHorizontal='$4'
            borderRadius='$3'
          >
            Submit Review
          </Button>
        </YStack>
      )}
    </YStack>
  );
});
