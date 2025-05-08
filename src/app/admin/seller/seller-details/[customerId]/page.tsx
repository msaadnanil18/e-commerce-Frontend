'use client';
import React, { useState, useEffect, FC } from 'react';

import {
  XStack,
  YStack,
  Text,
  Card,
  Button,
  ScrollView,
  Spinner,
  TextArea,
  Tabs,
  H5,
  Separator,
} from 'tamagui';
import {
  FaFileAlt as FileText,
  FaBuilding as Building,
  FaCreditCard as CreditCard,
  FaMapMarkerAlt as MapPin,
  FaTimes,
  FaCheck,
  FaHistory,
} from 'react-icons/fa';

import { ServiceErrorManager } from '@/helpers/service';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { IoAlertCircle } from 'react-icons/io5';
import RenderDriveFile from '@/components/appComponets/fileupload/RenderDriveFile';
import { ISeller, IStatusLog } from '@/types/seller';
import {
  ApproveRejectSellerService,
  GetSellerDetailsService,
} from '@/services/seller';
import Modal from '@/components/appComponets/modal/PopupModal';
import AsyncSelect from '@/components/appComponets/select/AsyncSelect';

const SellerDetails: FC = () => {
  const params = useParams();
  const [seller, setSeller] = useState<ISeller | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  const [status, setStatus] = useState<string>('');

  const fetchSellers = async () => {
    setIsLoading(true);
    const [err, response] = await ServiceErrorManager(
      GetSellerDetailsService({
        data: {
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
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleApprove = () => {
    setProcessingAction(true);
    ServiceErrorManager(
      ApproveRejectSellerService({
        data: {
          payload: {
            isApproved: true,
            sellerId: params.customerId,
            status: 'approved',
            reason: 'Application approved',
          },
        },
      }),
      {}
    )
      .then(([_, data]) => {
        setSeller(data.updateSellerStatus);
      })
      .finally(() => {
        setShowConfirmDialog(false);
        setProcessingAction(false);
      });
  };

  const handleReject = async () => {
    if (!rejectionReason.trim() || !status) return;
    setProcessingAction(true);
    ServiceErrorManager(
      ApproveRejectSellerService({
        data: {
          payload: {
            isApproved: false,
            sellerId: params.customerId,
            status: status,
            rejectionReason: rejectionReason,
            reason: rejectionReason,
            canRefill: status === 'rejected' ? true : false,
          },
        },
      }),
      {}
    )
      .then(([_, data]) => {
        if (data?.updateSellerStatus) {
          setSeller(data.updateSellerStatus);
        }
      })
      .finally(() => {
        setShowRejectDialog(false);
        setRejectionReason('');
        setProcessingAction(false);
      });
  };

  const handleStatusChange = () => {
    // For sellers that aren't in pending state
    if (!seller || seller.status === 'pending') return;

    setShowRejectDialog(true);
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

  const getStatusBadge = (status: string) => {
    const color = getStatusColor(status);
    return (
      <YStack
        backgroundColor={`$${color}2`}
        paddingHorizontal='$2'
        paddingVertical='$1'
        borderRadius='$2'
      >
        <Text color={`$${color}10`} fontWeight='bold' textTransform='uppercase'>
          {status}
        </Text>
      </YStack>
    );
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack space='$4'>
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

              {getStatusBadge(seller.status)}
            </XStack>

            {seller.rejectionReason && (
              <YStack
                marginTop='$3'
                backgroundColor='$red2'
                padding='$3'
                borderRadius='$2'
              >
                <XStack alignItems='center' space='$2'>
                  <IoAlertCircle />
                  <Text fontWeight='bold'>Reason:</Text>
                  <Text marginTop='$1'>{seller.rejectionReason}</Text>
                </XStack>
              </YStack>
            )}
          </Card>

          <Tabs
            defaultValue='details'
            orientation='horizontal'
            flex={1}
            flexDirection='column'
          >
            <ScrollView horizontal>
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
                <Tabs.Tab space='$2' value='history'>
                  <FaHistory />
                  <Text>Status History</Text>
                </Tabs.Tab>
              </Tabs.List>
            </ScrollView>

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
                    value={dayjs((seller as any)?.createdAt).format(
                      'DD/MM/YYYY'
                    )}
                  />
                  <InfoItem
                    label='Can Refill'
                    value={seller.canRefill ? 'Yes' : 'No'}
                  />
                  {seller.refilledAt && (
                    <InfoItem
                      label='Last Refilled'
                      value={dayjs(seller.refilledAt).format('DD/MM/YYYY')}
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

            <Tabs.Content value='history'>
              <Card padding='$4' bordered marginTop='$4'>
                <H5 marginBottom='$4'>Status History</H5>
                {seller.statusLogs && seller.statusLogs.length > 0 ? (
                  <YStack space='$3'>
                    {seller.statusLogs.map((log: IStatusLog, index: number) => (
                      <ScrollView maxHeight={200}>
                        <YStack key={index} paddingVertical='$2'>
                          {index > 0 && <Separator marginVertical='$2' />}
                          <XStack
                            justifyContent='space-between'
                            alignItems='center'
                          >
                            <XStack space='$2' alignItems='center'>
                              {getStatusBadge(log.status)}
                              <Text>{log.reason}</Text>
                            </XStack>
                            <Text fontSize='$3' color='$gray11'>
                              {dayjs(log.createdAt).format('DD/MM/YYYY')}
                            </Text>
                          </XStack>
                        </YStack>
                      </ScrollView>
                    ))}
                  </YStack>
                ) : (
                  <YStack
                    height={100}
                    justifyContent='center'
                    alignItems='center'
                  >
                    <Text color='$gray11'>No status history available</Text>
                  </YStack>
                )}
              </Card>
            </Tabs.Content>
          </Tabs>

          {seller.status === 'pending' ? (
            <Card padding='$4' bordered marginTop='$2'>
              <XStack space='$4' justifyContent='flex-end'>
                <Button
                  icon={<FaTimes />}
                  variant='outlined'
                  size='$3'
                  onPress={() => setShowRejectDialog(true)}
                >
                  Reject
                </Button>
                <Button
                  icon={<FaCheck />}
                  size='$3'
                  backgroundColor='$primary'
                  onPress={() => setShowConfirmDialog(true)}
                >
                  Approve
                </Button>
              </XStack>
            </Card>
          ) : (
            <Card padding='$4' bordered marginTop='$2'>
              <XStack space='$4' justifyContent='flex-end'>
                <Button
                  icon={<FaHistory />}
                  size='$3'
                  variant='outlined'
                  onPress={handleStatusChange}
                >
                  Change Status
                </Button>
              </XStack>
            </Card>
          )}
        </YStack>
      </ScrollView>

      <Modal
        open={showRejectDialog}
        isLoading={processingAction}
        onClose={() => {
          setShowRejectDialog(false);
          setRejectionReason('');
          setStatus('');
        }}
        title={
          seller?.status === 'pending'
            ? 'Reject Seller'
            : 'Change Seller Status'
        }
        description={
          seller?.status === 'pending'
            ? 'Please provide a reason for rejecting this seller application.'
            : "Update the seller's status and provide a reason for the change."
        }
        confirmText={
          seller?.status === 'pending' ? 'Confirm Rejection' : 'Update Status'
        }
        confirmButtonProps={{
          backgroundColor: '$red10',
        }}
        {...(rejectionReason.trim() && status
          ? { onConfirm: handleReject }
          : {})}
      >
        <YStack marginTop='$3' space='$3'>
          <AsyncSelect
            size='$3'
            options={[
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'restricted', label: 'Restricted' },
              { value: 'suspended', label: 'Suspended' },
            ].filter(
              (option) =>
                // Don't show current status as an option
                seller?.status !== option.value
            )}
            placeholder='Select status'
            onChange={(value) => {
              setStatus(value);
            }}
          />
          <TextArea
            placeholder='Enter reason for status change...'
            value={rejectionReason}
            onChangeText={setRejectionReason}
            minHeight={100}
          />
        </YStack>
      </Modal>

      <Modal
        open={showConfirmDialog}
        title='Approve Seller'
        description='Are you sure you want to approve this seller? They will be able to list products on the platform.'
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleApprove}
        confirmButtonProps={{ backgroundColor: '$primary' }}
        isLoading={processingAction}
        confirmText='Confirm Approve'
      />
    </YStack>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <XStack>
    <Text color='$gray11' width='40%' fontSize='$3'>
      {label}:
    </Text>
    <Text flex={1} fontSize='$3' fontWeight='500'>
      {value || 'N/A'}
    </Text>
  </XStack>
);

export default SellerDetails;
