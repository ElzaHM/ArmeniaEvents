import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Typography } from 'antd';
import { CheckCircleOutlined, LeftOutlined } from '@ant-design/icons';

import { formatFullDate } from '../../components/events/eventDateUtils';
import '../../components/home/home.css';
import '../../components/event-details/event-details.css';
import { QueryState } from '../../hooks/queries/query-state';
import { useEvent } from '../../hooks/queries/useEvent';
import { useReserveTicket } from '../../hooks/queries/useTickets';
import { useAuth } from '../../hooks/useAuth';

import pageStyles from '../../components/event-details/EventDetails.module.css';
import ticketStyles from '../../components/event-details/TicketPanel.module.css';

export default function EventCheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { data: event, isLoading, isError, error } = useEvent(id);
  const reserveTicket = useReserveTicket();

  const checkoutPath = id ? `/events/${id}/checkout` : location.pathname;

  const handleBuyTicket = () => {
    if (!id) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/signin', {
        state: {
          from: checkoutPath,
        },
      });
      return;
    }

    reserveTicket.mutate({ eventId: id });
  };

  const venueName = event?.venue?.name || event?.location;
  const reservation = reserveTicket.data;

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error} minHeight={240}>
      {event && (
        <div className={pageStyles.detailsPage}>
          <div className={`detailsSection ${pageStyles.backBar}`}>
            <Link to={`/events/${event.id}`} className={pageStyles.backLink}>
              <LeftOutlined />
              Back to Event
            </Link>
          </div>

          <div className="detailsSection">
            <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 24, color: 'var(--home-text)' }}>
              Checkout
            </Typography.Title>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 280px) minmax(0, 1fr)',
                gap: 28,
                alignItems: 'start',
              }}
            >
              <img
                src={event.imageUrl}
                alt={event.title}
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  objectFit: 'cover',
                  borderRadius: 12,
                  border: '1px solid var(--details-glass-border)',
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Typography.Title level={3} style={{ margin: 0, color: 'var(--home-text)' }}>
                  {event.title}
                </Typography.Title>

                <Typography.Text style={{ color: 'var(--home-text-secondary)' }}>
                  <strong style={{ color: 'var(--home-text)' }}>Date:</strong>{' '}
                  {formatFullDate(event.date, event.time)}
                </Typography.Text>

                <Typography.Text style={{ color: 'var(--home-text-secondary)' }}>
                  <strong style={{ color: 'var(--home-text)' }}>Venue:</strong> {venueName}
                </Typography.Text>

                <Typography.Text style={{ color: 'var(--home-text-secondary)' }}>
                  <strong style={{ color: 'var(--home-text)' }}>Price:</strong>{' '}
                  <span className={ticketStyles.pricePaid}>{event.price}</span>
                </Typography.Text>
              </div>
            </div>

            <aside
              className={`${ticketStyles.panel} detailsGlassCard`}
              style={{ maxWidth: 480, marginTop: 28 }}
            >
              {reservation ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'center' }}>
                  <Typography.Text style={{ fontSize: 18, color: '#52c41a', fontWeight: 600 }}>
                    <CheckCircleOutlined /> Ticket reserved
                  </Typography.Text>
                  <Typography.Text style={{ color: 'var(--home-text-secondary)' }}>
                    Your ticket code:
                  </Typography.Text>
                  <Typography.Text
                    strong
                    style={{
                      fontSize: 24,
                      letterSpacing: 1,
                      color: 'var(--home-text)',
                    }}
                  >
                    {reservation.ticketCode}
                  </Typography.Text>
                </div>
              ) : (
                <>
                  {reserveTicket.isError ? (
                    <Alert
                      type="error"
                      showIcon
                      message="Reservation failed"
                      description={
                        reserveTicket.error instanceof Error
                          ? reserveTicket.error.message
                          : 'Please try again.'
                      }
                      style={{ marginBottom: 16 }}
                    />
                  ) : null}

                  <Button
                    type="primary"
                    size="large"
                    block
                    className={ticketStyles.getTicketBtn}
                    loading={reserveTicket.isPending}
                    onClick={handleBuyTicket}
                  >
                    Buy Ticket
                  </Button>
                </>
              )}
            </aside>
          </div>
        </div>
      )}
    </QueryState>
  );
}
