'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  XStack,
  YStack,
  H1,
  H2,
  Text,
  Card,
  Button,
  Separator,
  ScrollView,
  Spinner,
  Image,
  Dialog,
  TextArea,
  Tabs,
  H4,
  H5,
} from 'tamagui';
import {
  FaCheck as Check,
  FaTimes as X,
  FaChevronRight as ChevronRight,
  FaEye as Eye,
  FaFileAlt as FileText,
  FaUser as User,
  FaBuilding as Building,
  FaCreditCard as CreditCard,
  FaMapMarkerAlt as MapPin,
  FaArrowLeft,
} from 'react-icons/fa';

import { ServiceErrorManager } from '@/helpers/service';

import { useParams } from 'next/navigation';
import { IoAlertCircle } from 'react-icons/io5';
import RenderDriveFile from '@/components/appComponets/fileupload/RenderDriveFile';
import { GetService } from '@/services/crud';
import { ISeller } from '@/types/seller';

const SellerDetails = () => {
  const router = useRouter();
  const params = useParams();
  const [seller, setSeller] = useState<ISeller | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  const fetchSellers = async () => {
    setIsLoading(true);
    try {
      const [err, response] = await ServiceErrorManager(
        GetService({
          data: {
            schema: 'Seller',
            query: {
              _id: params.customerId,
            },
          },
        }),
        {
          failureMessage: 'Error while fetching customer details!',
        }
      );
      if (err || !response) return;
      setSeller(response || {});
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleApprove = async () => {
    setProcessingAction(true);
    try {
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Failed to approve seller:', error);
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      return;
    }
    setProcessingAction(true);
    try {
      setShowRejectDialog(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject seller:', error);
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'approved':
        return 'green';
      case 'restricted':
        return 'red';
      case 'suspended':
        return 'purple';
      case 'rejected':
        return 'crimson';
      default:
        return 'gray';
    }
  };

  if (isLoading || !seller) {
    return (
      <YStack
        height='100vh'
        justifyContent='center'
        alignItems='center'
        space='$2'
      >
        <Spinner size='large' />
        <Text>Loading seller details...</Text>
      </YStack>
    );
  }

  return (
    <YStack padding='$4' space='$4' flex={1} backgroundColor='$background'>
      {/* <XStack alignItems='center' space='$3'>
        <Button
          icon={<FaArrowLeft />}
          variant='outlined'
          onPress={() => router.back()}
          circular
        />
        <H4>Seller Review</H4>
      </XStack> */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack space='$4'>
          {/* Header */}
          <Card padding='$4' bordered>
            <XStack justifyContent='space-between' alignItems='center'>
              <YStack>
                <Text fontSize='$6' fontWeight='bold'>
                  {seller.businessName}
                </Text>
                <Text fontSize='$3' color='$gray11'>
                  GST: {seller.gstNumber}
                </Text>
              </YStack>

              {seller.status.toUpperCase()}
            </XStack>

            {seller.rejectionReason && (
              <YStack
                marginTop='$3'
                backgroundColor='$red2'
                padding='$3'
                borderRadius='$2'
              >
                <XStack alignItems='center' space='$2'>
                  <IoAlertCircle color='$red10' />
                  <Text fontWeight='bold' color='$red10'>
                    Rejection Reason:
                  </Text>
                </XStack>
                <Text color='$red10' marginTop='$1'>
                  {seller.rejectionReason}
                </Text>
              </YStack>
            )}
          </Card>

          <Tabs
            defaultValue='details'
            orientation='horizontal'
            flex={1}
            flexDirection='column'
          >
            <Tabs.List>
              <Tabs.Tab space='$2' value='details'>
                <Building />
                <Text>Business Details</Text>
              </Tabs.Tab>
              <Tabs.Tab space='$2' value='address'>
                <MapPin />
                <Text>Address</Text>
              </Tabs.Tab>
              <Tabs.Tab space='$2' value='bank'>
                <CreditCard />
                <Text>Bank Details</Text>
              </Tabs.Tab>
              <Tabs.Tab space='$2' value='documents'>
                <FileText />
                <Text>Documents</Text>
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Content value='details'>
              <Card padding='$4' bordered marginTop='$4'>
                <H5 marginBottom='$4'>Business Information</H5>
                <YStack space='$3'>
                  <InfoItem label='Business Name' value={seller.businessName} />
                  <InfoItem label='GST Number' value={seller.gstNumber} />
                  <InfoItem label='Contact Email' value={seller.contactEmail} />
                  <InfoItem label='Contact Phone' value={seller.contactPhone} />
                  <InfoItem
                    label='Commission Rate'
                    value={`${seller.commissionRate}%`}
                  />
                  <InfoItem
                    label='Registration Date'
                    value={new Date(
                      (seller as any)?.createdAt
                    ).toLocaleDateString()}
                  />
                  <InfoItem
                    label='Can Refill'
                    value={seller.canRefill ? 'Yes' : 'No'}
                  />
                  {seller.refilledAt && (
                    <InfoItem
                      label='Last Refilled'
                      value={new Date(seller.refilledAt).toLocaleDateString()}
                    />
                  )}
                </YStack>
              </Card>
            </Tabs.Content>

            <Tabs.Content value='address'>
              <Card padding='$4' bordered marginTop='$4'>
                <H5 marginBottom='$4'>Address Details</H5>
                <YStack space='$3'>
                  <InfoItem label='Street' value={seller.address.street} />
                  <InfoItem label='City' value={seller.address.city} />
                  <InfoItem label='State' value={seller.address.state} />
                  <InfoItem label='Country' value={seller.address.country} />
                  <InfoItem
                    label='Postal Code'
                    value={seller.address.postalCode}
                  />
                </YStack>
              </Card>
            </Tabs.Content>

            <Tabs.Content value='bank'>
              <Card padding='$4' bordered marginTop='$4'>
                <H5 marginBottom='$4'>Bank Information</H5>
                <YStack space='$3'>
                  <InfoItem
                    label='Account Holder'
                    value={seller.bankDetails.accountHolderName}
                  />
                  <InfoItem
                    label='Bank Name'
                    value={seller.bankDetails.bankName}
                  />
                  <InfoItem
                    label='Account Number'
                    value={seller.bankDetails.accountNumber.replace(
                      /\d(?=\d{4})/g,
                      '•'
                    )}
                  />
                  <InfoItem
                    label='IFSC Code'
                    value={seller.bankDetails.ifscCode}
                  />
                </YStack>
              </Card>
            </Tabs.Content>

            <Tabs.Content value='documents'>
              <Card padding='$4' bordered marginTop='$4'>
                <H5 marginBottom='$4'>Verification Documents</H5>
                {seller.documents && seller.documents.length > 0 ? (
                  <YStack space='$4'>
                    {seller.documents.map((doc, index) => (
                      <XStack space='$3' key={index}>
                        <YStack>
                          <RenderDriveFile
                            file={doc as any}
                            inline
                            style={{
                              width: '64px',
                              height: '64px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                            }}
                          />
                        </YStack>
                      </XStack>
                    ))}
                  </YStack>
                ) : (
                  <YStack
                    height={150}
                    justifyContent='center'
                    alignItems='center'
                  >
                    <Text color='$gray11'>No documents uploaded</Text>
                  </YStack>
                )}
              </Card>
            </Tabs.Content>
          </Tabs>

          {seller.status === 'pending' && (
            <Card padding='$4' bordered marginTop='$2'>
              <XStack space='$4' justifyContent='flex-end'>
                <Button
                  variant='outlined'
                  size='$4'
                  onPress={() => setShowRejectDialog(true)}
                >
                  Reject
                </Button>
                <Button
                  size='$4'
                  backgroundColor='$primary'
                  onPress={() => setShowConfirmDialog(true)}
                >
                  Approve
                </Button>
              </XStack>
            </Card>
          )}
        </YStack>
      </ScrollView>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <Dialog.Portal>
          <Dialog.Overlay
            key='overlay'
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            key='content'
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            space
          >
            <Dialog.Title fontSize='$4.5' fontWeight='bold'>
              Reject Seller
            </Dialog.Title>
            <Dialog.Description>
              Please provide a reason for rejecting this seller application.
            </Dialog.Description>

            <TextArea
              placeholder='Enter rejection reason...'
              value={rejectionReason}
              onChangeText={setRejectionReason}
              minHeight={100}
            />

            <XStack space='$3' justifyContent='flex-end'>
              <Dialog.Close asChild>
                <Button variant='outlined' disabled={processingAction}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                // theme="red"
                onPress={handleReject}
                disabled={!rejectionReason.trim() || processingAction}
              >
                {processingAction ? <Spinner /> : 'Confirm Rejection'}
              </Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <Dialog.Portal>
          <Dialog.Overlay
            key='overlay'
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            key='content'
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            space
          >
            <Dialog.Title fontWeight='bold' fontSize='$4.5'>
              Approve Seller
            </Dialog.Title>
            <Dialog.Description>
              Are you sure you want to approve this seller? They will be able to
              list products on the platform.
            </Dialog.Description>

            <XStack space='$3' justifyContent='flex-end'>
              <Dialog.Close asChild>
                <Button variant='outlined' disabled={processingAction}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                backgroundColor='$primary'
                onPress={handleApprove}
                disabled={processingAction}
              >
                {processingAction ? <Spinner /> : 'Confirm Approval'}
              </Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <XStack>
    <Text color='$gray11' width='40%' fontSize='$3'>
      {label}:
    </Text>
    <Text flex={1} fontSize='$3' fontWeight='500'>
      {value}
    </Text>
  </XStack>
);

export default SellerDetails;
