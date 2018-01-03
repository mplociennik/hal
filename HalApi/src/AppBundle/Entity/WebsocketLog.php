<?php

namespace AppBundle\Entity;

use AppBundle\Utils\Traits\EntityDateTimes;
use Doctrine\ORM\Mapping as ORM;

/**
 * WebsocketLog
 *
 * @ORM\Table(name="websocket_log")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\WebsocketLogRepository")
 */
class WebsocketLog
{
	use EntityDateTimes;

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
	 */
	public function setData(string $data)
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

