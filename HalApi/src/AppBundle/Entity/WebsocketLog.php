<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * WebsocketLog
 *
 * @ORM\Table(name="websocket_log")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\WebsocketLogRepository")
 */
class WebsocketLog
{
	/**
	 * @var int
	 *
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	private $id;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="clientFrom", type="string", length=255)
	 */
	private $clientFrom;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="clientTo", type="string", length=255)
	 */
	private $clientTo;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="event", type="string", length=200)
	 */
	private $event;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="data", type="string", length=255)
	 */
	private $data;

	/**
	 * @var \DateTime
	 *
	 * @ORM\Column(name="createdAt", type="datetime")
	 */
	private $createdAt;

	/**
	 * @var \DateTime
	 *
	 * @ORM\Column(name="updatedAt", type="datetime")
	 */
	private $updatedAt;


	/**
	 * Get id
	 *
	 * @return int
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * Set clientFrom
	 *
	 * @param string $clientFrom
	 *
	 * @return WebsocketLog
	 */
	public function setClientFrom($clientFrom)
	{
		$this->clientFrom = $clientFrom;
	}

	/**
	 * Get clientFrom
	 *
	 * @return string
	 */
	public function getClientFrom()
	{
		return $this->clientFrom;
	}

	/**
	 * Set clientTo
	 *
	 * @param string $clientTo
	 *
	 * @return WebsocketLog
	 */
	public function setClientTo($clientTo)
	{
		$this->clientTo = $clientTo;
	}

	/**
	 * Get clientTo
	 *
	 * @return string
	 */
	public function getClientTo()
	{
		return $this->clientTo;
	}

	/**
	 * Set data
	 *
	 * @param string $data
	 *
	 * @return WebsocketLog
	 */
	public function setData($data)
	{
		$this->data = $data;
	}

	/**
	 * Get data
	 *
	 * @return string
	 */
	public function getData()
	{
		return $this->data;
	}

	/**
	 * Set createdAt
	 *
	 * @param \DateTime $createdAt
	 *
	 * @return WebsocketLog
	 */
	public function setCreatedAt(\DateTime $createdAt)
	{
		$this->createdAt = $createdAt;
	}

	/**
	 * Get createdAt
	 *
	 * @return \DateTime
	 */
	public function getCreatedAt()
	{
		return $this->createdAt;
	}

	/**
	 * Set updatedAt
	 *
	 * @param \DateTime $updatedAt
	 *
	 * @return WebsocketLog
	 */
	public function setUpdatedAt(\DateTime $updatedAt)
	{
		$this->updatedAt = $updatedAt;
	}

	/**
	 * Get updatedAt
	 *
	 * @return \DateTime
	 */
	public function getUpdatedAt()
	{
		return $this->updatedAt;
	}

	/**
	 * @return string
	 */
	public function getEvent(): string
	{
		return $this->event;
	}

	/**
	 * @param string $event
	 */
	public function setEvent(string $event): void
	{
		$this->event = $event;
	}
}

